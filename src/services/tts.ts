import { logger } from '../lib/logger'

const MAX_TEXT_LENGTH = 5000

export async function synthesizeSpeech(text: string): Promise<Blob> {
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
    throw new Error(`TTS failed: ${response.status}`)
  }

  return response.blob()
}

let currentAudio: HTMLAudioElement | null = null

export async function speak(text: string): Promise<void> {
  stopSpeaking()

  const blob = await synthesizeSpeech(text)
  const url = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const audio = new Audio(url)
    currentAudio = audio

    audio.onended = () => {
      URL.revokeObjectURL(url)
      currentAudio = null
      resolve()
    }

    audio.onerror = (e) => {
      URL.revokeObjectURL(url)
      currentAudio = null
      reject(e)
    }

    audio.play().catch(reject)
  })
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
}
