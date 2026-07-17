let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let currentStream: MediaStream | null = null
let silenceTimer: ReturnType<typeof setTimeout> | null = null
let analyser: AnalyserNode | null = null
let audioContext: AudioContext | null = null
let silenceCheckInterval: ReturnType<typeof setInterval> | null = null

const SILENCE_THRESHOLD = 15
const SILENCE_TIMEOUT_MS = 2000
let onSilenceCallback: (() => void) | null = null

function cleanupStream() {
  if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null }
  if (silenceCheckInterval) { clearInterval(silenceCheckInterval); silenceCheckInterval = null }
  if (audioContext) { audioContext.close().catch(() => {}); audioContext = null }
  analyser = null
  onSilenceCallback = null
  if (currentStream) {
    currentStream.getTracks().forEach((t) => t.stop())
    currentStream = null
  }
  mediaRecorder = null
  audioChunks = []
}

function startSilenceDetection(stream: MediaStream) {
  audioContext = new AudioContext()
  const source = audioContext.createMediaStreamSource(stream)
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 512
  source.connect(analyser)

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  let hasSpoken = false

  silenceCheckInterval = setInterval(() => {
    if (!analyser) return
    analyser.getByteFrequencyData(dataArray)
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
    const avg = sum / dataArray.length

    if (avg > SILENCE_THRESHOLD) {
      hasSpoken = true
      if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null }
    } else if (hasSpoken) {
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => {
          if (onSilenceCallback) onSilenceCallback()
        }, SILENCE_TIMEOUT_MS)
      }
    }
  }, 100)
}

export async function startRecording(onSilence?: () => void): Promise<void> {
  cleanupStream()
  onSilenceCallback = onSilence || null

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
    },
  })

  currentStream = stream
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
  startSilenceDetection(stream)
}

export async function stopRecording(): Promise<string> {
  if (!mediaRecorder || mediaRecorder.state === 'inactive' || !currentStream) {
    cleanupStream()
    return ''
  }

  return new Promise((resolve) => {
    mediaRecorder!.onstop = async () => {
      const chunks = [...audioChunks]
      const mime = mediaRecorder!.mimeType
      cleanupStream()

      if (chunks.length === 0) {
        resolve('')
        return
      }

      try {
        const blob = new Blob(chunks, { type: mime })
        if (blob.size < 1000) {
          resolve('')
          return
        }
        const base64 = await blobToBase64(blob)
        const format = mime.includes('webm') ? 'webm' : 'mp3'
        const text = await transcribe(base64, format)
        resolve(text)
      } catch (err) {
        console.error('STT error:', err)
        resolve('')
      }
    }

    mediaRecorder!.stop()
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

export function isRecording(): boolean {
  return mediaRecorder !== null && mediaRecorder.state === 'recording'
}
