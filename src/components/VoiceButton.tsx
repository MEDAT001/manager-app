import { OrbAnimation } from './OrbAnimation'

interface Props {
  isListening: boolean
  isSupported: boolean
  onToggle: () => void
}

function GoldMicSVG() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function VoiceButton({ isListening, isSupported, onToggle }: Props) {
  if (!isSupported) return null

  return (
    <div className="flex items-center justify-center">
      {isListening ? (
        <button
          onClick={onToggle}
          className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #F5D67B)',
            boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
            animation: 'pulse-gold 1.5s ease-in-out infinite',
          }}
          aria-label="Arrêter l'écoute"
        >
          <OrbAnimation size={32} />
          <GoldMicSVG />
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            border: '1px solid rgba(212,175,55,0.15)',
            background: 'rgba(212,175,55,0.04)',
            color: '#C9A84C',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.12)'
            e.currentTarget.style.color = '#F5D67B'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.color = '#C9A84C'
          }}
          aria-label="Activer le mode vocal"
        >
          <GoldMicSVG />
        </button>
      )}
    </div>
  )
}
