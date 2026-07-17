let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null

// Premium French male voice IDs (ordered by preference)
const FRENCH_VOICES = [
  { id: 'jUHQdLfy668sllNiNTSW', name: 'Clément' },    // Middle-aged French male
  { id: 'CYR0HqHoZAUmoZsLWPob', name: 'Sébastien' },  // Warm, calm, narrative
  { id: '6kimG24ccauj1GNOEFjF', name: 'Benjamin' },    // Velvety, warm timbre
  { id: 'fz4G5jaMWUPbfs2rKKNy', name: 'Frédéric' },   // Confident, warm
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },        // Premade fallback, deep male
]

const VOICE_MODEL = 'eleven_multilingual_v2'

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

  let lastError: Error | null = null

  for (const voice of FRENCH_VOICES) {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: truncated,
          voice_id: voice.id,
          model_id: VOICE_MODEL,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()

      if (arrayBuffer.byteLength < 1000) {
        throw new Error('Audio trop petit')
      }

      const ctx = getAudioContext()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

      await new Promise<void>((resolve, reject) => {
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

      return
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      continue
    }
  }

  throw lastError || new Error('All ElevenLabs voices failed')
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
    utterance.rate = 0.9
    utterance.pitch = 0.85
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
  if (currentSource) {
    try { currentSource.stop() } catch { /* already stopped */ }
    currentSource = null
  }
  if (window.speechSynthesis) {
    speechSynthesis.cancel()
  }
}
