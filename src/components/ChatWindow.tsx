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
        <div className="w-[88px] h-[88px] rounded-[28px] overflow-hidden mb-6 shadow-lg"
          style={{ boxShadow: '0 12px 40px rgba(108,99,255,0.25)' }}>
          <img src="/logo.png" alt="Samir" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2 tracking-tight">
          Salut, je suis Samir.
        </h2>
        <p className="text-sm text-text-secondary max-w-[280px] leading-relaxed font-medium">
          Ton coach personnel. Dis-moi ce qui t'amène et on avance ensemble.
        </p>
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
