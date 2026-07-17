import { useCallback, useRef } from 'react'
import { RefreshCw, Volume2, VolumeX } from 'lucide-react'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { useChat } from './hooks/useChat'
import { useVoiceRecognition } from './hooks/useVoiceRecognition'
import { useVoiceMode } from './hooks/useVoiceMode'

export default function App() {
  const voiceMode = useVoiceMode()

  const speakRef = useRef(voiceMode.speakText)
  speakRef.current = voiceMode.speakText

  const chat = useChat({
    onReply: voiceMode.isVoiceMode ? (text) => speakRef.current(text) : undefined,
  })

  const sendMessageRef = useRef(chat.sendMessage)
  sendMessageRef.current = chat.sendMessage

  const handleVoiceResult = useCallback((text: string) => {
    sendMessageRef.current(text)
  }, [])

  const voice = useVoiceRecognition(handleVoiceResult)

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
          <button
            onClick={voiceMode.toggle}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              voiceMode.isVoiceMode
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-text-muted hover:bg-surface-hover hover:text-primary'
            }`}
            aria-label={voiceMode.isVoiceMode ? 'Mode silencieux' : 'Mode vocal'}
            title={voiceMode.isVoiceMode ? 'Mode silencieux' : 'Mode conversation'}
          >
            {voiceMode.isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          {chat.messages.length > 0 && (
            <button
              onClick={chat.clearMessages}
              className="p-2.5 rounded-xl text-text-muted hover:bg-surface-hover hover:text-primary transition-all duration-200"
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
            >
              <RefreshCw size={16} />
            </button>
          )}
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
        onVoiceToggle={voice.isListening ? voice.stopListening : voice.startListening}
      />
    </div>
  )
}
