function findFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices()
  const french = voices.filter((v) => v.lang.startsWith('fr'))
  if (french.length === 0) return null
  const male = french.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('homme'))
  return male || french[0]
}

export function initSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  speechSynthesis.getVoices()
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices()
}

export async function speak(text: string): Promise<void> {
  stopSpeaking()

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

    const voice = findFrenchVoice()
    if (voice) {
      utterance.voice = voice
      console.log('Using voice:', voice.name, voice.lang)
    }

    utterance.onend = () => {
      resolve()
    }

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

export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    speechSynthesis.cancel()
  }
}
