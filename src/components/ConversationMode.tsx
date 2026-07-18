import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { OrbAnimation } from './OrbAnimation'

interface Props {
  isSpeaking: boolean
  isListening: boolean
  isThinking: boolean
  transcription: string
  voiceError: string | null
  lastReply: string
  onBack: () => void
  onMicToggle: () => void
}

export function ConversationMode({
  isSpeaking,
  isListening,
  isThinking,
  transcription,
  voiceError,
  lastReply,
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
    <div className="h-full flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #0f0c29 0%, #1a1145 40%, #24243e 100%)' }}>

      {/* Background orbs */}
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[100px] -top-24 -left-20"
        style={{ background: '#6C63FF', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute w-[250px] h-[250px] rounded-full opacity-20 blur-[100px] -bottom-20 -right-16"
        style={{ background: '#FF6B9D', animation: 'float 8s ease-in-out infinite 3s' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            aria-label="Retour au choix"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="font-bold text-white text-[15px] tracking-tight block leading-tight">
              Samir
            </span>
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
              isSpeaking ? 'text-[#8B83FF]' : isListening ? 'text-[#FF8FB8]' : 'text-[#43E97B]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                isSpeaking ? 'bg-[#8B83FF] animate-pulse' : isListening ? 'bg-[#FF8FB8] animate-pulse' : 'bg-[#43E97B]'
              }`} />
              {isSpeaking ? 'Samir parle...' : isListening ? 'Écoute...' : isThinking ? 'Réfléchit...' : 'En ligne'}
            </span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-[10px] overflow-hidden shadow-lg"
          style={{ boxShadow: '0 4px 16px rgba(108,99,255,0.3)' }}>
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="relative mb-10">
          <OrbAnimation
            size={180}
            isActive={true}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
        </div>

        <div className="w-full max-w-md text-center min-h-[120px]">
          {voiceError ? (
            <div className="px-5 py-4 rounded-2xl text-sm"
              style={{ background: 'rgba(255,87,87,0.1)', color: '#FF5757', border: '1px solid rgba(255,87,87,0.2)' }}>
              {voiceError}
              <button onClick={onMicToggle}
                className="block mx-auto mt-2 text-xs font-semibold text-[#8B83FF] hover:underline">
                Réessayer
              </button>
            </div>
          ) : isThinking ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-[#8B83FF] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-white/40 text-sm font-medium">Samir réfléchit...</span>
            </div>
          ) : displayedText ? (
            <p className="text-xl text-white leading-relaxed font-semibold tracking-[-0.01em]">
              {displayedText}
              {isTyping && <span className="inline-block w-0.5 h-5 bg-[#8B83FF] ml-1 animate-pulse align-text-bottom" />}
            </p>
          ) : isListening ? (
            <div>
              <p className="text-[#FF8FB8] font-semibold text-sm mb-2">Parle maintenant...</p>
              {transcription && (
                <p className="text-white/70 text-base italic">"{transcription}"</p>
              )}
            </div>
          ) : (
            <p className="text-white/40 text-[15px] font-medium">Appuie sur le micro pour commencer</p>
          )}
        </div>
      </div>

      {/* Mic button */}
      <div className="flex justify-center pb-12 relative z-10">
        <button
          onClick={onMicToggle}
          disabled={isSpeaking || isThinking}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'scale-110'
              : isSpeaking || isThinking
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'hover:scale-105'
          }`}
          style={{
            background: isListening
              ? 'linear-gradient(135deg, #FF6B9D, #FF8FB8)'
              : isSpeaking || isThinking
                ? undefined
                : 'linear-gradient(135deg, #6C63FF, #8B83FF)',
            boxShadow: isListening
              ? '0 8px 32px rgba(255,107,157,0.4)'
              : isSpeaking || isThinking
                ? 'none'
                : '0 8px 32px rgba(108,99,255,0.4)',
            animation: isListening ? 'pulse-mic 1.5s ease-in-out infinite' : undefined,
          }}
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
