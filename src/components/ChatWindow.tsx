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
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-5 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2 tracking-tight">
          Salut, je suis Samir.
        </h2>
        <p className="text-sm text-text-secondary max-w-[280px] leading-relaxed">
          Ton coach personnel. Dis-moi ce qui t'amène et on avance ensemble.
        </p>

        <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-[320px]">
          {[
            "Je suis débordé au travail",
            "J'ai un conflit avec un collègue",
            "Je me sens bloqué",
          ].map((suggestion) => (
            <button
              key={suggestion}
              className="px-4 py-2.5 text-xs font-medium text-text-secondary bg-surface-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 hover:text-primary transition-all duration-200 cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
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
