import type { Message } from '../lib/types'

interface Props {
  message: Message
  isTyping?: boolean
}

export function MessageBubble({ message, isTyping }: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-2.5 animate-slide-up px-1 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
          <span className="text-white font-bold text-xs">S</span>
        </div>
      )}

      <div
        className={`max-w-[78%] md:max-w-[65%] px-4 py-3 text-[14px] leading-relaxed tracking-[-0.01em] ${
          isUser
            ? 'bg-user-bg text-white rounded-[20px] rounded-br-md shadow-lg shadow-primary/15'
            : 'bg-surface-card text-text-primary rounded-[20px] rounded-bl-md shadow-sm border border-border'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content ? (
            <>
              {message.content}
              {isTyping && (
                <span className="inline-block w-[2px] h-[16px] bg-primary rounded-full ml-0.5 animate-pulse align-text-bottom" />
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-peach to-accent flex items-center justify-center shadow-md shadow-accent/20">
          <span className="text-white font-bold text-xs">Toi</span>
        </div>
      )}
    </div>
  )
}
