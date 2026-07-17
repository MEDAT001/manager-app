let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null

function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

export function initAudioContext(): void {
  getAudioContext()
}

// PRIMARY: ElevenLabs via serverless
async function speakElevenLabs(text: string): Promise<void> {
  const truncated = text.length > 5000 ? text.slice(0, 5000) + '...' : text

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: truncated }),
  })

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()

  if (arrayBuffer.byteLength < 1000) {
    throw new Error('Audio trop petit, réponse invalide')
  }

  const ctx = getAudioContext()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

  return new Promise((resolve, reject) => {
    const source = ctx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(ctx.destination)
    currentSource = source

    source.onended = () => {
      currentSource = null
      resolve()
    }

    try {
      source.start(0)
    } catch (err) {
      currentSource = null
      reject(err)
    }
  })
}

// FALLBACK: SpeechSynthesis navigateur
function speakFallback(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('SpeechSynthesis non supporté'))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-FR'
    utterance.rate = 1.0
    utterance.pitch = 0.9
    utterance.volume = 1.0

    const voices = speechSynthesis.getVoices()
    const french = voices.filter((v) => v.lang.startsWith('fr'))
    if (french.length > 0) {
      utterance.voice = french[0]
    }

    utterance.onend = () => resolve()
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') {
        resolve()
      } else {
        reject(new Error(`Speech error: ${e.error}`))
      }
    }

    speechSynthesis.speak(utterance)
  })
}

// MAIN: Try ElevenLabs, fallback to SpeechSynthesis
export async function speak(text: string): Promise<void> {
  stopSpeaking()

  try {
    await speakElevenLabs(text)
  } catch (err) {
    console.warn('ElevenLabs failed, using fallback:', err)
    await speakFallback(text)
  }
}

export function stopSpeaking(): void {
  // Stop Web Audio
  if (currentSource) {
    try { currentSource.stop() } catch { /* already stopped */ }
    currentSource = null
  }
  // Stop SpeechSynthesis
  if (window.speechSynthesis) {
    speechSynthesis.cancel()
  }
}
