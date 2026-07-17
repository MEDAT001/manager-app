import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface Props {
  isSpeaking: boolean
  isListening: boolean
  isThinking: boolean
  transcription: string
  voiceStatus: string
  voiceError: string | null
  lastReply: string
  awaitingUser: boolean
  onBack: () => void
  onMicToggle: () => void
}

export function ConversationMode({
  isSpeaking,
  isListening,
  isThinking,
  transcription,
  voiceStatus,
  voiceError,
  lastReply,
  awaitingUser,
  onBack,
  onMicToggle,
}: Props) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingRef = useRef(false)
  const textRef = useRef(lastReply)

  useEffect(() => {
    if (lastReply === textRef.current) return
    textRef.current = lastReply
    typingRef.current = true
    setIsTyping(true)

    const words = lastReply.split(/(\s+)/)
    let revealed = ''
    let i = 0

    const interval = setInterval(() => {
      if (i >= words.length || !typingRef.current) {
        clearInterval(interval)
        setIsTyping(false)
        typingRef.current = false
        return
      }
      revealed += words[i]
      setDisplayedText(revealed)
      i++
    }, 40)

    return () => {
      typingRef.current = false
      clearInterval(interval)
    }
  }, [lastReply])

  useEffect(() => {
    if (!lastReply) {
      setDisplayedText('')
    }
  }, [lastReply])

  return (
    <div className="h-full flex flex-col bg-surface">
      <header className="flex items-center px-5 py-4 border-b border-border bg-surface-card/80 backdrop-blur-xl">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl text-text-muted hover:bg-surface-hover hover:text-primary transition-all duration-200 mr-3"
          aria-label="Retour au choix"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span className="font-semibold text-text-primary text-[15px] tracking-tight block leading-tight">
            Samir
          </span>
          <span className={`text-[11px] font-medium flex items-center gap-1 ${
            isSpeaking ? 'text-primary' : isListening ? 'text-accent' : 'text-mint'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${
              isSpeaking ? 'bg-primary animate-pulse' : isListening ? 'bg-accent animate-pulse' : 'bg-mint'
            }`} />
            {isSpeaking ? 'Samir parle...' : isListening ? 'Écoute...' : 'En ligne'}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Orb */}
        <div className="relative mb-8">
          <div className={`absolute -inset-8 rounded-full transition-all duration-700 ${
            isSpeaking
              ? 'bg-primary/10 scale-110'
              : isListening
                ? 'bg-accent/10 scale-105'
                : 'bg-primary/5'
          }`} />

          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-lg shadow-primary/10">
            <div className={`absolute inset-2 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 transition-all duration-500 ${
              isSpeaking ? 'animate-pulse scale-110' : ''
            }`} />
            <div className={`absolute inset-5 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-xl shadow-primary/30 transition-all duration-500 ${
              isSpeaking ? 'scale-105' : ''
            }`}>
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>

          {isListening && !isSpeaking && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* Text area */}
        <div className="w-full max-w-md text-center min-h-[120px]">
          {voiceError ? (
            <div className="px-4 py-3 bg-danger/10 text-danger text-sm rounded-2xl">
              {voiceError}
              <button onClick={onMicToggle}
                className="block mx-auto mt-2 text-xs font-medium text-primary hover:underline">
                Réessayer
              </button>
            </div>
          ) : isThinking ? (
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-text-muted text-sm">Samir réfléchit...</span>
            </div>
          ) : displayedText ? (
            <p className="text-lg text-text-primary leading-relaxed font-medium">
              {displayedText}
              {isTyping && <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse align-text-bottom" />}
            </p>
          ) : isListening ? (
            <div>
              <p className="text-accent font-medium text-sm mb-1">{voiceStatus || 'Parle...'}</p>
              {transcription && (
                <p className="text-text-primary text-base italic">"{transcription}"</p>
              )}
            </div>
          ) : (
            <p className="text-text-muted text-sm">
              {awaitingUser
                ? 'Appuie sur le micro pour répondre'
                : 'Appuie sur le micro pour commencer'}
            </p>
          )}
        </div>
      </div>

      {/* Mic button */}
      <div className="flex justify-center pb-10">
        <button
          onClick={onMicToggle}
          disabled={isSpeaking}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isListening
              ? 'bg-accent text-white shadow-accent/30 scale-110 animate-pulse'
              : isSpeaking
                ? 'bg-text-muted/30 text-text-muted cursor-not-allowed'
                : 'bg-primary text-white shadow-primary/30 hover:scale-105'
          }`}
          aria-label={isListening ? 'Arrêter' : 'Parler'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      </div>
    </div>
  )
}
