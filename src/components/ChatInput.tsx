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
    <div className="px-4 md:px-6 pb-5 pt-2">
      <div className="flex items-end gap-3 max-w-2xl mx-auto">
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
            className="w-full resize-none rounded-[22px] border border-border bg-surface-card px-5 py-3.5 pr-14 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-40"
            style={{ minHeight: '48px', maxHeight: '140px' }}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`absolute right-2 bottom-2 p-2.5 rounded-xl transition-all duration-200 ${
              canSend
                ? 'bg-primary text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 active:scale-90'
                : 'bg-surface-hover text-text-muted'
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
