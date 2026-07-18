import { Mic } from 'lucide-react'
import { OrbAnimation } from './OrbAnimation'

interface Props {
  isListening: boolean
  isSupported: boolean
  onToggle: () => void
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
            background: 'linear-gradient(135deg, #FF6B9D, #FF8FB8)',
            boxShadow: '0 4px 20px rgba(255,107,157,0.3)',
            animation: 'pulse-mic 1.5s ease-in-out infinite',
          }}
          aria-label="Arrêter l'écoute"
        >
          <OrbAnimation size={32} />
          <Mic size={14} className="absolute inset-0 m-auto text-white z-10" />
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-200 text-[#A8A8C0] hover:text-[#6C63FF] hover:border-[#6C63FF] hover:shadow-[0_4px_16px_rgba(108,99,255,0.12)] hover:scale-105"
          style={{
            border: '1.5px solid #F0EEFA',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          aria-label="Activer le mode vocal"
        >
          <Mic size={17} />
        </button>
      )}
    </div>
  )
}
