import { useState, useCallback } from 'react'
import { speak, stopSpeaking } from '../services/tts'

export function useVoiceMode() {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const enable = useCallback(() => {
    setIsVoiceMode(true)
  }, [])

  const disable = useCallback(() => {
    setIsVoiceMode(false)
    stopSpeaking()
    setIsSpeaking(false)
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
    try {
      await speak(text)
    } catch {
      // TTS error — silent fail
    } finally {
      setIsSpeaking(false)
    }
  }, [])

  return { isVoiceMode, isSpeaking, enable, disable, toggle, speakText }
}
