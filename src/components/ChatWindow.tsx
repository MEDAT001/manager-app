import { useEffect, useRef } from 'react'
import type { Message } from '../lib/types'
import { MessageBubble } from './MessageBubble'

interface Props {
  messages: Message[]
  isTyping?: boolean
}

export function ChatWindow({ messages, isTyping }: Props) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="relative w-[96px] h-[96px] mx-auto mb-8">
          <div className="absolute inset-[-2px] rounded-[30px] opacity-50"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F5D67B, #C9A84C)' }}>
            <div className="w-full h-full rounded-[28px]" style={{ background: '#12101f' }} />
          </div>
          <div className="relative w-full h-full rounded-[28px] overflow-hidden"
            style={{ boxShadow: '0 16px 48px rgba(212,175,55,0.15)' }}>
            <img src="/logo.png" alt="Coach" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="text-lg font-bold mb-2 tracking-tight" style={{ color: '#FFF8E7' }}>
          Bonjour. Quel est l'objectif précis de notre séance aujourd'hui ?
        </h2>
      </div>
    )
  }

  const lastMsg = messages[messages.length - 1]
  const isLastAssistantTyping = isTyping && lastMsg?.role === 'assistant'

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isTyping={msg.id === lastMsg?.id && isLastAssistantTyping}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}
