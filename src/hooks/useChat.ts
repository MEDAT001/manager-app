import { useState, useCallback, useRef } from 'react'
import type { Message } from '../lib/types'
import { sendMessage, sendMessageStream } from '../services/openrouter'
import { API } from '../lib/constants'
import { logger } from '../lib/logger'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

interface UseChatOptions {
  onReply?: (text: string) => void
  onSentence?: (sentence: string) => void
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesRef = useRef<Message[]>([])
  const abortRef = useRef(false)
  const onReplyRef = useRef(options?.onReply)
  const onSentenceRef = useRef(options?.onSentence)

  messagesRef.current = messages
  onReplyRef.current = options?.onReply
  onSentenceRef.current = options?.onSentence

  const sendMessageToAPI = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || isLoading) return

    setError(null)
    abortRef.current = false

    const userMsg: Message = {
      id: uid(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    const assistantMsg: Message = {
      id: uid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMsg])

    try {
      const allMessages = [...messagesRef.current.slice(0, -1), userMsg]

      // Streaming mode: yield sentences as they arrive
      if (onSentenceRef.current) {
        let fullText = ''
        let sentenceBuffer = ''
        setIsTyping(true)

        for await (const sentence of sendMessageStream(allMessages)) {
          if (abortRef.current) break

          fullText += sentence + ' '
          sentenceBuffer += sentence + ' '

          // Update message with revealed text
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: fullText.trim() } : m,
            ),
          )

          // Send sentence to TTS immediately
          onSentenceRef.current(sentence)
        }

        setIsTyping(false)

        if (!abortRef.current && onReplyRef.current) {
          onReplyRef.current(fullText.trim())
        }
      } else {
        // Non-streaming mode (chat mode)
        const fullText = await sendMessage(allMessages)

        if (abortRef.current) return

        const words = fullText.split(/(\s+)/)
        let revealed = ''
        setIsTyping(true)

        for (let i = 0; i < words.length; i++) {
          if (abortRef.current) break
          revealed += words[i]
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: revealed } : m,
            ),
          )
          await new Promise((r) => setTimeout(r, API.TYPING_DELAY_MS))
        }

        setIsTyping(false)

        if (!abortRef.current && onReplyRef.current) {
          onReplyRef.current(fullText)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      logger.error('Erreur envoi', msg)
      setError(msg)
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id))
      setIsTyping(false)
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearMessages = useCallback(() => {
    abortRef.current = true
    setMessages([])
    setError(null)
    setIsTyping(false)
  }, [])

  return { messages, isLoading, isTyping, error, sendMessage: sendMessageToAPI, clearMessages }
}
