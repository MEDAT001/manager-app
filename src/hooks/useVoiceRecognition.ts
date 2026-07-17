import { useState, useCallback, useRef } from 'react'
import type { VoiceState } from '../lib/types'
import { logger } from '../lib/logger'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

export function useVoiceRecognition(onResult: (text: string) => void) {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    transcript: '',
    isSupported:
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  })

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(() => {
    if (!state.isSupported) {
      logger.warn('Speech recognition non supporté')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setState((s) => ({ ...s, isListening: true, transcript: '' }))
      logger.info('Écoute démarrée')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setState((s) => ({
        ...s,
        transcript: finalTranscript || interimTranscript,
      }))

      if (finalTranscript) {
        logger.info('Transcription complète', finalTranscript)
        onResult(finalTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      logger.error('Erreur speech', event.error)
      setState((s) => ({ ...s, isListening: false }))
    }

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }))
      logger.info('Écoute terminée')
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [state.isSupported, onResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setState((s) => ({ ...s, isListening: false }))
  }, [])

  return { ...state, startListening, stopListening }
}
