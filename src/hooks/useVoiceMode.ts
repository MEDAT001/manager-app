import { useState, useCallback } from 'react'
import { speak, stopSpeaking, initAudioContext } from '../services/tts'

export function useVoiceMode() {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsError, setTtsError] = useState<string | null>(null)

  const enable = useCallback(() => {
    initAudioContext()
    setIsVoiceMode(true)
    setTtsError(null)
  }, [])

  const disable = useCallback(() => {
    setIsVoiceMode(false)
    stopSpeaking()
    setIsSpeaking(false)
    setTtsError(null)
  }, [])

  const toggle = useCallback(() => {
    if (isVoiceMode) {
      disable()
    } else {
      enable()
    }
  }, [isVoiceMode, enable, disable])

  const speakText = useCallback(async (text: string) => {
    if (!text.trim()) return
    setIsSpeaking(true)
    setTtsError(null)
    try {
      await speak(text)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      setTtsError(msg)
    } finally {
      setIsSpeaking(false)
    }
  }, [])

  return { isVoiceMode, isSpeaking, ttsError, enable, disable, toggle, speakText }
}
