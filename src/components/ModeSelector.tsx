import { MessageSquare, Mic } from 'lucide-react'

interface Props {
  onSelect: (mode: 'chat' | 'conversation') => void
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 bg-surface">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
          Salut, je suis Samir.
        </h1>
        <p className="text-sm text-text-secondary max-w-[300px] leading-relaxed">
          Ton coach personnel. Comment veux-tu discuter ?
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-[380px]">
        <button
          onClick={() => onSelect('chat')}
          className="flex-1 group p-6 rounded-[20px] border border-border bg-surface-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer text-center"
        >
          <div className="w-14 h-14 rounded-[16px] bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
            <MessageSquare size={24} className="text-primary" />
          </div>
          <span className="font-semibold text-text-primary text-[15px] block mb-1">Chat</span>
          <span className="text-[12px] text-text-secondary leading-snug block">
            Écris et lis les réponses
          </span>
        </button>

        <button
          onClick={() => onSelect('conversation')}
          className="flex-1 group p-6 rounded-[20px] border border-border bg-surface-card hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer text-center"
        >
          <div className="w-14 h-14 rounded-[16px] bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/15 transition-colors">
            <Mic size={24} className="text-accent" />
          </div>
          <span className="font-semibold text-text-primary text-[15px] block mb-1">Conversation</span>
          <span className="text-[12px] text-text-secondary leading-snug block">
            Parle et écoute Samir
          </span>
        </button>
      </div>
    </div>
  )
}
