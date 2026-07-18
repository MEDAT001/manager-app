let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null
let audioQueue: AudioBuffer[] = []
let isPlayingQueue = false
let stopQueueFlag = false

const FRENCH_VOICES = [
  { id: 'jUHQdLfy668sllNiNTSW', name: 'Clément' },
  { id: 'CYR0HqHoZAUmoZsLWPob', name: 'Sébastien' },
  { id: '6kimG24ccauj1GNOEFjF', name: 'Benjamin' },
  { id: 'fz4G5jaMWUPbfs2rKKNy', name: 'Frédéric' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
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

async function fetchElevenLabs(text: string): Promise<ArrayBuffer> {
  const truncated = text.length > 5000 ? text.slice(0, 5000) + '...' : text

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

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const buf = await response.arrayBuffer()
      if (buf.byteLength < 1000) throw new Error('Audio trop petit')
      return buf
    } catch {
      continue
    }
  }

  throw new Error('All voices failed')
}

async function playAudioBuffer(buffer: AudioBuffer): Promise<void> {
  const ctx = getAudioContext()
  return new Promise((resolve, reject) => {
    const source = ctx.createBufferSource()
    source.buffer = buffer
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

async function processQueue() {
  if (isPlayingQueue) return
  isPlayingQueue = true

  while (audioQueue.length > 0 && !stopQueueFlag) {
    const buffer = audioQueue.shift()!
    try {
      await playAudioBuffer(buffer)
    } catch {
      // skip failed segment
    }
  }

  isPlayingQueue = false
}

// STREAMING: Add sentence to queue, plays in order
export async function speakStream(text: string): Promise<void> {
  if (stopQueueFlag) return
  if (!text.trim()) return

  try {
    const arrayBuffer = await fetchElevenLabs(text)
    const ctx = getAudioContext()
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
    audioQueue.push(audioBuffer)
    processQueue()
  } catch (err) {
    console.warn('TTS segment failed:', err)
  }
}

// SINGLE: Play one text (used in chat mode)
export async function speak(text: string): Promise<void> {
  stopSpeaking()

  try {
    await speakElevenLabs(text)
  } catch (err) {
    console.warn('ElevenLabs failed, using fallback:', err)
    await speakFallback(text)
  }
}

async function speakElevenLabs(text: string): Promise<void> {
  const arrayBuffer = await fetchElevenLabs(text)
  const ctx = getAudioContext()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
  await playAudioBuffer(audioBuffer)
}

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
    if (french.length > 0) utterance.voice = french[0]

    utterance.onend = () => resolve()
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') resolve()
      else reject(new Error(`Speech error: ${e.error}`))
    }

    speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking(): void {
  stopQueueFlag = true
  audioQueue = []
  isPlayingQueue = false

  if (currentSource) {
    try { currentSource.stop() } catch { /* already stopped */ }
    currentSource = null
  }
  if (window.speechSynthesis) {
    speechSynthesis.cancel()
  }

  // Reset flag after a tick so new speak calls work
  setTimeout(() => { stopQueueFlag = false }, 50)
}

export function isCurrentlySpeaking(): boolean {
  return currentSource !== null || isPlayingQueue
}
