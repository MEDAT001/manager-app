import { Mic, MicOff } from 'lucide-react'
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
          className="relative p-3 rounded-2xl bg-accent-soft text-accent transition-all duration-300 hover:bg-accent/20 shadow-sm"
          aria-label="Arrêter l'écoute"
        >
          <OrbAnimation size={36} />
          <MicOff size={16} className="absolute inset-0 m-auto text-accent z-10" />
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="p-3 rounded-2xl text-text-muted bg-surface-card border border-border transition-all duration-200 hover:bg-surface-hover hover:text-primary hover:border-primary/30 hover:shadow-sm"
          aria-label="Activer le mode vocal"
        >
          <Mic size={18} />
        </button>
      )}
    </div>
  )
}
