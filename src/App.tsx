import { useCallback, useRef } from 'react'
import { RefreshCw, MoreHorizontal } from 'lucide-react'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { useChat } from './hooks/useChat'
import { useVoiceRecognition } from './hooks/useVoiceRecognition'
import { useVoiceMode } from './hooks/useVoiceMode'

export default function App() {
  const voiceMode = useVoiceMode()

  const speakRef = useRef(voiceMode.speakText)
  speakRef.current = voiceMode.speakText

  const enableVoiceRef = useRef(voiceMode.enable)
  enableVoiceRef.current = voiceMode.enable

  const chat = useChat({
    onReply: voiceMode.isVoiceMode
      ? async (text) => {
          await speakRef.current(text)
          // Auto-restart mic after speaking
          if (voiceMode.isVoiceMode) {
            setTimeout(() => enableVoiceRef.current(), 500)
          }
        }
      : undefined,
  })

  const sendMessageRef = useRef(chat.sendMessage)
  sendMessageRef.current = chat.sendMessage

  const handleVoiceResult = useCallback((text: string) => {
    sendMessageRef.current(text)
  }, [])

  const voice = useVoiceRecognition(handleVoiceResult)

  const handleMicToggle = useCallback(() => {
    if (voice.isListening) {
      voice.stopListening()
    } else {
      voiceMode.enable()
      voice.startListening()
    }
  }, [voice, voiceMode])

  return (
    <div className="h-full flex flex-col bg-surface">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-card/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <span className="font-semibold text-text-primary text-[15px] tracking-tight block leading-tight">
              Samir
            </span>
            <span className="text-[11px] text-mint font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-mint rounded-full inline-block" />
              En ligne
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chat.messages.length > 0 && (
            <button
              onClick={() => {
                chat.clearMessages()
                voiceMode.disable()
                if (voice.isListening) voice.stopListening()
              }}
              className="p-2.5 rounded-xl text-text-muted hover:bg-surface-hover hover:text-primary transition-all duration-200"
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
            >
              <RefreshCw size={16} />
            </button>
          )}
          <button className="p-2.5 rounded-xl text-text-muted hover:bg-surface-hover transition-all duration-200">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      {chat.error && (
        <div className="mx-4 mt-3 px-4 py-3 bg-danger/10 text-danger text-xs text-center rounded-2xl">
          {chat.error}
        </div>
      )}

      <ChatWindow messages={chat.messages} isTyping={chat.isTyping} />

      <ChatInput
        onSend={chat.sendMessage}
        isLoading={chat.isLoading}
        voiceEnabled={true}
        isListening={voice.isListening}
        isVoiceSupported={voice.isSupported}
        onVoiceToggle={handleMicToggle}
      />
    </div>
  )
}
