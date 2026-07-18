import { useState, useCallback, useEffect, useRef } from 'react'
import { speak, speakStream, stopSpeaking, initAudioContext, isCurrentlySpeaking } from '../services/tts'

export function useVoiceMode() {
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsError, setTtsError] = useState<string | null>(null)
  const speakingCheckRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    initAudioContext()
  }, [])

  // Track speaking state with polling for streaming mode
  useEffect(() => {
    if (isVoiceMode) {
      speakingCheckRef.current = setInterval(() => {
        const speaking = isCurrentlySpeaking()
        setIsSpeaking(speaking)
      }, 200)
    }
    return () => {
      if (speakingCheckRef.current) {
        clearInterval(speakingCheckRef.current)
        speakingCheckRef.current = null
      }
    }
  }, [isVoiceMode])

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
    setTtsError(null)
    try {
      await speakStream(text)
    } catch (err) {
      setTtsError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
    // Don't set isSpeaking=false here - the polling interval handles it
  }, [])

  return { isVoiceMode, isSpeaking, ttsError, enable, disable, speakText, speakTextStream }
}
