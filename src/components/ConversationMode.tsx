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

function GoldMicLarge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
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
      style={{ background: 'linear-gradient(165deg, #0a0818 0%, #12101f 30%, #1a1635 60%, #0d0b1a 100%)' }}>

      {/* Gold radial accents */}
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[120px] -top-32 -left-32"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.02] blur-[120px] -bottom-24 -right-24"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 relative z-10"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
            style={{ border: '1px solid rgba(212,175,55,0.12)', color: '#C9A84C' }}
            aria-label="Retour au choix"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="font-bold text-[15px] tracking-tight block leading-tight"
              style={{ color: '#FFF8E7' }}>
              Samir
            </span>
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
              isSpeaking ? 'text-[#F5D67B]' : isListening ? 'text-[#D4AF37]' : 'text-[#C9A84C]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                isSpeaking ? 'bg-[#F5D67B] animate-pulse' : isListening ? 'bg-[#D4AF37] animate-pulse' : 'bg-[#C9A84C]'
              }`} />
              {isSpeaking ? 'Samir parle...' : isListening ? 'Écoute...' : isThinking ? 'Réfléchit...' : 'En ligne'}
            </span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-[10px] overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.15)' }}>
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
              style={{ background: 'rgba(212,175,55,0.05)', color: '#F5D67B', border: '1px solid rgba(212,175,55,0.15)' }}>
              {voiceError}
              <button onClick={onMicToggle}
                className="block mx-auto mt-2 text-xs font-semibold hover:underline"
                style={{ color: '#D4AF37' }}>
                Réessayer
              </button>
            </div>
          ) : isThinking ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce"
                    style={{ background: '#D4AF37', animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,248,231,0.35)' }}>
                Samir réfléchit...
              </span>
            </div>
          ) : displayedText ? (
            <p className="text-xl leading-relaxed font-semibold tracking-[-0.01em]"
              style={{ color: '#FFF8E7' }}>
              {displayedText}
              {isTyping && <span className="inline-block w-0.5 h-5 ml-1 animate-pulse align-text-bottom"
                style={{ background: '#D4AF37' }} />}
            </p>
          ) : isListening ? (
            <div>
              <p className="font-semibold text-sm mb-2" style={{ color: '#D4AF37' }}>Parle maintenant...</p>
              {transcription && (
                <p className="text-base italic" style={{ color: 'rgba(255,248,231,0.5)' }}>"{transcription}"</p>
              )}
            </div>
          ) : (
            <p className="text-[15px] font-medium" style={{ color: 'rgba(255,248,231,0.3)' }}>
              Appuie sur le micro pour commencer
            </p>
          )}
        </div>
      </div>

      {/* Mic button */}
      <div className="flex justify-center pb-12 relative z-10">
        <button
          onClick={onMicToggle}
          disabled={isSpeaking || isThinking}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
            isListening
              ? 'scale-110'
              : isSpeaking || isThinking
                ? 'cursor-not-allowed'
                : 'hover:scale-105'
          }`}
          style={{
            background: isListening
              ? 'linear-gradient(135deg, #D4AF37, #F5D67B)'
              : isSpeaking || isThinking
                ? 'rgba(212,175,55,0.06)'
                : 'linear-gradient(135deg, #D4AF37, #F5D67B)',
            color: isListening ? '#0a0818' : isSpeaking || isThinking ? 'rgba(212,175,55,0.2)' : '#0a0818',
            boxShadow: isListening
              ? '0 8px 40px rgba(212,175,55,0.35), 0 0 60px rgba(212,175,55,0.1)'
              : isSpeaking || isThinking
                ? 'none'
                : '0 8px 32px rgba(212,175,55,0.2)',
            animation: isListening ? 'pulse-gold 1.5s ease-in-out infinite' : undefined,
          }}
          aria-label={isListening ? 'Arrêter' : 'Parler'}
        >
          <GoldMicLarge />
        </button>
      </div>
    </div>
  )
}
