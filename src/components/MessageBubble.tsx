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
        <div className="flex-shrink-0 w-9 h-9 rounded-[14px] overflow-hidden shadow-md"
          style={{ boxShadow: '0 4px 12px rgba(108,99,255,0.2)' }}>
          <img src="/logo.png" alt="S" className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className={`max-w-[78%] md:max-w-[65%] px-4 py-3 text-[14px] leading-relaxed tracking-[-0.01em] ${
          isUser
            ? 'text-white rounded-[20px] rounded-br-md shadow-lg'
            : 'text-[#1A1635] rounded-[20px] rounded-bl-md shadow-sm border border-[#F0EEFA]'
        }`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #6C63FF, #8B83FF)'
            : '#fff',
          boxShadow: isUser
            ? '0 4px 12px rgba(108,99,255,0.2)'
            : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content ? (
            <>
              {message.content}
              {isTyping && (
                <span className="inline-block w-[2px] h-[16px] bg-[#6C63FF] rounded-full ml-0.5 animate-pulse align-text-bottom" />
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="w-2 h-2 bg-[#6C63FF]/40 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#6C63FF]/40 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#6C63FF]/40 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-[14px] flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #FF9A76, #FF6B9D)', boxShadow: '0 4px 12px rgba(255,107,157,0.2)' }}>
          <span className="text-white font-bold text-[10px]">Toi</span>
        </div>
      )}
    </div>
  )
}
