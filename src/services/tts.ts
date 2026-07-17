import { logger } from '../lib/logger'

const MAX_TEXT_LENGTH = 5000

let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null
let currentTimeout: ReturnType<typeof setTimeout> | null = null

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

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  const truncated = text.length > MAX_TEXT_LENGTH
    ? text.slice(0, MAX_TEXT_LENGTH) + '...'
    : text

  logger.info('Synthèse vocale ElevenLabs', { length: truncated.length })

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: truncated }),
  })

  if (!response.ok) {
    const errBody = await response.text().catch(() => '')
    logger.error('TTS failed', response.status, errBody)
    throw new Error(`TTS failed: ${response.status}`)
  }

  return response.arrayBuffer()
}

export async function speak(text: string): Promise<void> {
  stopSpeaking()

  const arrayBuffer = await synthesizeSpeech(text)
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

export function stopSpeaking(): void {
  if (currentTimeout) {
    clearTimeout(currentTimeout)
    currentTimeout = null
  }
  if (currentSource) {
    try {
      currentSource.stop()
    } catch {
      // already stopped
    }
    currentSource = null
  }
}
