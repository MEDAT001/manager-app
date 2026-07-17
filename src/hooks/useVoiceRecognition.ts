import { useState, useCallback, useRef } from 'react'
import type { VoiceState } from '../lib/types'

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
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  const checkMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      return result.state === 'granted'
    } catch {
      return true // permissions API not available, assume OK
    }
  }, [])

  const startListening = useCallback(async () => {
    setError(null)

    if (!state.isSupported) {
      const msg = 'Reconnaissance vocale non supportée par ce navigateur'
      setError(msg)
      console.error(msg)
      return
    }

    // Check mic permission first
    const hasPermission = await checkMicPermission()
    if (!hasPermission) {
      const msg = 'Autorise le micro dans les paramètres du navigateur'
      setError(msg)
      console.error(msg)
      return
    }

    setStatus('Démarrage du micro...')

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setState((s) => ({ ...s, isListening: true, transcript: '' }))
      setStatus('Parle maintenant...')
      console.log('Speech recognition started')
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

      const display = finalTranscript || interimTranscript
      setState((s) => ({ ...s, transcript: display }))

      if (finalTranscript) {
        console.log('Speech result:', finalTranscript)
        setStatus('Compris ! Envoi...')
        onResultRef.current(finalTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech error:', event.error)
      const errorMessages: Record<string, string> = {
        'no-speech': 'Aucune voix détectée, réessaie',
        'audio-capture': 'Micro non disponible',
        'not-allowed': 'Accès micro refusé. Autorise-le dans le navigateur.',
        'network': 'Erreur réseau — vérifie ta connexion',
        'aborted': 'Écoute annulée',
        'language-not-supported': 'Langue non supportée',
        'service-not-allowed': 'Service de reconnaissance non disponible',
      }
      const msg = errorMessages[event.error] || `Erreur: ${event.error}`
      setError(msg)
      setStatus('')
      setState((s) => ({ ...s, isListening: false }))
    }

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }))
      setStatus('')
      console.log('Speech recognition ended')
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Impossible de démarrer le micro')
      setStatus('')
    }
  }, [state.isSupported, checkMicPermission])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setState((s) => ({ ...s, isListening: false }))
    setStatus('')
  }, [])

  return { ...state, error, status, startListening, stopListening }
}
