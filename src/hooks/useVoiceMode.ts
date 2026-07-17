import { useState, useCallback, useRef } from 'react'
import { speak, stopSpeaking } from '../services/tts'

export function useVoiceMode() {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const abortRef = useRef(false)

  const toggle = useCallback(() => {
    setIsVoiceMode((prev) => {
      if (prev) {
        stopSpeaking()
        setIsSpeaking(false)
      }
      return !prev
    })
  }, [])

  const speakText = useCallback(async (text: string) => {
    if (!text.trim()) return
    abortRef.current = false
    setIsSpeaking(true)
    try {
      await speak(text)
    } catch {
      // TTS error — silent fail
    } finally {
      setIsSpeaking(false)
    }
  }, [])

  const stop = useCallback(() => {
    abortRef.current = true
    stopSpeaking()
    setIsSpeaking(false)
  }, [])

  return { isVoiceMode, isSpeaking, toggle, speakText, stop }
}
