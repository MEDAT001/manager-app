import { useState, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { VoiceButton } from './VoiceButton'
import { LIMITS } from '../lib/constants'

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
    <div className="px-4 md:px-6 pb-6 pt-3"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid #F0EEFA' }}>
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
            className="w-full resize-none rounded-full border-[1.5px] border-[#F0EEFA] bg-white px-5 py-3 pr-14 text-sm text-[#1A1635] placeholder:text-[#A8A8C0] focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.08),0_4px_12px_rgba(108,99,255,0.08)] transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] disabled:opacity-40"
            style={{ minHeight: '48px', maxHeight: '140px' }}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`absolute right-1.5 bottom-1.5 w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-200 ${
              canSend
                ? 'bg-gradient-to-br from-[#6C63FF] to-[#8B83FF] text-white shadow-[0_4px_16px_rgba(108,99,255,0.3)] hover:shadow-[0_6px_24px_rgba(108,99,255,0.4)] hover:scale-105 active:scale-95'
                : 'bg-[#F5F3FF] text-[#A8A8C0] shadow-none cursor-default'
            }`}
            aria-label="Envoyer"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
