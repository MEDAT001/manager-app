import { useState, type KeyboardEvent } from 'react'
import { VoiceButton } from './VoiceButton'
import { LIMITS } from '../lib/constants'

function GoldSendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="19" x2="12" y2="5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <polyline points="5 12 12 5 19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

interface Props {
  onSend: (text: string) => void
  isLoading: boolean
  voiceEnabled: boolean
  isListening: boolean
  isVoiceSupported: boolean
  onVoiceToggle: () => void
}

export function ChatInput({
  onSend,
  isLoading,
  voiceEnabled,
  isListening,
  isVoiceSupported,
  onVoiceToggle,
}: Props) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text)
      setText('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = text.trim().length > 0 && !isLoading

  return (
    <div className="px-4 md:px-6 pb-6 pt-3 relative"
      style={{
        background: 'rgba(18,16,31,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212,175,55,0.08)',
      }}>
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

      <div className="flex items-end gap-2.5 max-w-[680px] mx-auto">
        {voiceEnabled && (
          <VoiceButton
            isListening={isListening}
            isSupported={isVoiceSupported}
            onToggle={onVoiceToggle}
          />
        )}

        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, LIMITS.MAX_MESSAGE_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="Écris ton message..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none rounded-full px-5 py-3 pr-14 text-sm focus:outline-none transition-all duration-300 disabled:opacity-40"
            style={{
              border: '1px solid rgba(212,175,55,0.1)',
              background: 'rgba(255,248,231,0.04)',
              color: '#FFF8E7',
              minHeight: '48px',
              maxHeight: '140px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.05), 0 4px 16px rgba(212,175,55,0.08)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`absolute right-1.5 bottom-1.5 w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${
              canSend
                ? 'text-[#0a0818] hover:scale-105 active:scale-95'
                : 'cursor-default'
            }`}
            style={{
              background: canSend
                ? 'linear-gradient(135deg, #D4AF37, #F5D67B)'
                : 'rgba(212,175,55,0.08)',
              color: canSend ? '#0a0818' : 'rgba(212,175,55,0.2)',
              boxShadow: canSend ? '0 4px 16px rgba(212,175,55,0.25)' : 'none',
            }}
            aria-label="Envoyer"
          >
            <GoldSendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
