import { useState, useCallback, useEffect } from 'react'
import { speak, speakStream, stopSpeaking, initAudioContext } from '../services/tts'

export function useVoiceMode() {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsError, setTtsError] = useState<string | null>(null)

  useEffect(() => {
    initAudioContext()
  }, [])

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

  const speakText = useCallback(async (text: string) => {
    if (!text.trim()) return
    setIsSpeaking(true)
    setTtsError(null)
    try {
      await speak(text)
    } catch (err) {
      setTtsError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsSpeaking(false)
    }
  }, [])

  const speakTextStream = useCallback(async (text: string) => {
    if (!text.trim()) return
    setIsSpeaking(true)
    setTtsError(null)
    try {
      await speakStream(text)
    } catch (err) {
      setTtsError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }, [])

  return { isVoiceMode, isSpeaking, ttsError, enable, disable, speakText, speakTextStream }
}
