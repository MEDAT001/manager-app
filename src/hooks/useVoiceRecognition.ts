import { useState, useCallback, useRef } from 'react'
import { startRecording, stopRecording, isRecording } from '../services/stt'

export function useVoiceRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const processingRef = useRef(false)
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  const startListening = useCallback(async () => {
    if (isRecording()) return
    setError(null)
    setStatus('Démarrage du micro...')

    try {
      await startRecording()
      setIsListening(true)
      setTranscript('')
      setStatus('Parle maintenant...')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur micro'
      console.error('Recording error:', msg)
      setError(msg)
      setStatus('')
    }
  }, [])

  const stopListening = useCallback(async () => {
    if (!isRecording()) {
      setIsListening(false)
      return
    }
    if (processingRef.current) return
    processingRef.current = true

    setIsListening(false)
    setStatus('Transcription...')

    try {
      const text = await stopRecording()
      if (text.trim()) {
        console.log('STT result:', text)
        setTranscript(text)
        setStatus('Compris !')
        onResultRef.current(text)
      } else {
        setStatus('')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur transcription'
      console.error('STT error:', msg)
      setError(msg)
      setStatus('')
    } finally {
      processingRef.current = false
    }
  }, [])

  return { isListening, transcript, isSupported: typeof window !== 'undefined', error, status, startListening, stopListening }
}
