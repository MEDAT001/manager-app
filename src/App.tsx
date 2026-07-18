import { useCallback, useRef, useState } from 'react'
import { RefreshCw, MoreHorizontal } from 'lucide-react'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { ModeSelector } from './components/ModeSelector'
import { ConversationMode } from './components/ConversationMode'
import { useChat } from './hooks/useChat'
import { useVoiceRecognition } from './hooks/useVoiceRecognition'
import { useVoiceMode } from './hooks/useVoiceMode'

type AppMode = 'select' | 'chat' | 'conversation'

export default function App() {
  const [mode, setMode] = useState<AppMode>('select')
  const voiceMode = useVoiceMode()

  const speakStreamRef = useRef(voiceMode.speakTextStream)
  speakStreamRef.current = voiceMode.speakTextStream

  const speakRef = useRef(voiceMode.speakText)
  speakRef.current = voiceMode.speakText

  const [lastReply, setLastReply] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const autoRestartRef = useRef(false)

  const startListeningRef = useRef<() => void>(() => {})
  const stopListeningRef = useRef<() => void>(() => {})

  const chat = useChat({
    onSentence: mode === 'conversation' && voiceMode.isVoiceMode
      ? (sentence) => {
          // Stream each sentence to TTS immediately
          speakStreamRef.current(sentence)
        }
      : undefined,
    onReply: mode === 'conversation' && voiceMode.isVoiceMode
      ? async (fullText) => {
          // Full response received - set last reply for display, then restart mic
          stopListeningRef.current()
          setLastReply(fullText)
          setIsThinking(false)
          // Wait for remaining audio to finish, then restart mic
          await new Promise((r) => setTimeout(r, 1500))
          if (autoRestartRef.current) {
            startListeningRef.current()
          }
        }
      : undefined,
  })

  const sendMessageRef = useRef(chat.sendMessage)
  sendMessageRef.current = chat.sendMessage

  const handleVoiceResult = useCallback((text: string) => {
    autoRestartRef.current = true
    setIsThinking(false)
    setLastReply('')
    sendMessageRef.current(text)
  }, [])

  const voice = useVoiceRecognition(handleVoiceResult)
  startListeningRef.current = voice.startListening
  stopListeningRef.current = voice.stopListening

  const handleSelectMode = useCallback((selected: 'chat' | 'conversation') => {
    setMode(selected)
    autoRestartRef.current = false
    if (selected === 'conversation') {
      voiceMode.enable()
    }
  }, [voiceMode])

  const handleMicToggle = useCallback(() => {
    autoRestartRef.current = false
    if (voice.isListening) {
      voice.stopListening()
    } else {
      setIsThinking(false)
      voice.startListening()
    }
  }, [voice])

  const handleBackToSelect = useCallback(() => {
    autoRestartRef.current = false
    chat.clearMessages()
    voiceMode.disable()
    if (voice.isListening) voice.stopListening()
    setMode('select')
    setLastReply('')
    setIsThinking(false)
  }, [chat, voiceMode, voice])

  if (mode === 'select') {
    return <ModeSelector onSelect={handleSelectMode} />
  }

  if (mode === 'conversation') {
    return (
      <ConversationMode
        isSpeaking={voiceMode.isSpeaking}
        isListening={voice.isListening}
        isThinking={isThinking}
        transcription={voice.transcript}
        voiceError={voice.error}
        lastReply={lastReply}
        onBack={handleBackToSelect}
        onMicToggle={handleMicToggle}
      />
    )
  }

  return (
    <div className="h-full flex flex-col"
      style={{ background: 'linear-gradient(165deg, #0a0818 0%, #12101f 30%, #1a1635 60%, #0d0b1a 100%)' }}>
      <header className="flex items-center justify-between px-5 py-4 relative"
        style={{ background: 'rgba(10,8,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] overflow-hidden"
            style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.15)' }}>
            <img src="/logo.png" alt="Samir" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-[15px] tracking-tight block leading-tight"
              style={{ color: '#FFF8E7' }}>
              Samir
            </span>
            <span className="text-[11px] font-semibold flex items-center gap-1.5"
              style={{ color: '#C9A84C' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#C9A84C' }} />
              En ligne
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chat.messages.length > 0 && (
            <button
              onClick={() => {
                autoRestartRef.current = false
                chat.clearMessages()
                if (voice.isListening) voice.stopListening()
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ color: 'rgba(212,175,55,0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(212,175,55,0.4)'; e.currentTarget.style.background = 'transparent' }}
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
            >
              <RefreshCw size={15} />
            </button>
          )}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ color: 'rgba(212,175,55,0.4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(212,175,55,0.4)'; e.currentTarget.style.background = 'transparent' }}>
            <MoreHorizontal size={15} />
          </button>
        </div>
      </header>

      {chat.error && (
        <div className="mx-4 mt-3 px-4 py-3 text-xs text-center rounded-2xl"
          style={{ background: 'rgba(212,175,55,0.06)', color: '#F5D67B', border: '1px solid rgba(212,175,55,0.1)' }}>
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
