let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

export async function startRecording(): Promise<void> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
    },
  })

  audioChunks = []

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : 'audio/webm'

  mediaRecorder = new MediaRecorder(stream, { mimeType })

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data)
    }
  }

  mediaRecorder.start(250)
}

export async function stopRecording(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      reject(new Error('No active recording'))
      return
    }

    mediaRecorder.onstop = async () => {
      try {
        const blob = new Blob(audioChunks, { type: mediaRecorder!.mimeType })
        const base64 = await blobToBase64(blob)
        const format = mediaRecorder!.mimeType.includes('webm') ? 'webm' : 'mp3'
        const text = await transcribe(base64, format)
        resolve(text)
      } catch (err) {
        reject(err)
      } finally {
        mediaRecorder?.stream.getTracks().forEach((t) => t.stop())
        mediaRecorder = null
        audioChunks = []
      }
    }

    mediaRecorder.stop()
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function transcribe(base64Audio: string, format: string): Promise<string> {
  const response = await fetch('/api/stt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio: base64Audio, format }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`STT failed: ${response.status} ${err}`)
  }

  const data = await response.json()
  return data.text || ''
}
