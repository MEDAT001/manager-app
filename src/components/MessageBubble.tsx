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
        <div className="flex-shrink-0 w-9 h-9 rounded-[14px] overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.15)' }}>
          <img src="/logo.png" alt="S" className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className={`max-w-[78%] md:max-w-[65%] px-4 py-3 text-[14px] leading-relaxed tracking-[-0.01em] rounded-[20px] ${
          isUser
            ? 'rounded-br-md'
            : 'rounded-bl-md'
        }`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #D4AF37, #C9A84C)'
            : 'rgba(255,248,231,0.04)',
          color: isUser ? '#0a0818' : '#FFF8E7',
          border: isUser ? 'none' : '1px solid rgba(212,175,55,0.08)',
          boxShadow: isUser
            ? '0 4px 16px rgba(212,175,55,0.15)'
            : '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content ? (
            <>
              {message.content}
              {isTyping && (
                <span className="inline-block w-[2px] h-[16px] rounded-full ml-0.5 animate-pulse align-text-bottom"
                  style={{ background: '#D4AF37' }} />
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 py-0.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'rgba(212,175,55,0.3)', animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-[14px] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.12)' }}>
          <span className="font-bold text-[10px]" style={{ color: '#D4AF37' }}>Toi</span>
        </div>
      )}
    </div>
  )
}
