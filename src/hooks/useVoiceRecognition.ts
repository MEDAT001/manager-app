import { useState, useCallback } from 'react'
import { startRecording, stopRecording } from '../services/stt'

interface VoiceState {
  isListening: boolean
  transcript: string
  isSupported: boolean
}

export function useVoiceRecognition(onResult: (text: string) => void) {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    transcript: '',
    isSupported: typeof window !== 'undefined',
  })
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  const startListening = useCallback(async () => {
    setError(null)

    try {
      setStatus('Démarrage du micro...')
      await startRecording()
      setState((s) => ({ ...s, isListening: true, transcript: '' }))
      setStatus('Parle maintenant... puis clique pour arrêter')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur micro'
      console.error('Recording error:', msg)
      setError(msg)
      setStatus('')
    }
  }, [])

  const stopListening = useCallback(async () => {
    try {
      setStatus('Transcription en cours...')
      setState((s) => ({ ...s, isListening: false }))
      const text = await stopRecording()

      if (text.trim()) {
        console.log('STT result:', text)
        setStatus('Compris ! Envoi...')
        onResult(text)
      } else {
        setStatus('')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur transcription'
      console.error('STT error:', msg)
      setError(msg)
      setStatus('')
    }
  }, [onResult])

  return { ...state, error, status, startListening, stopListening }
}
