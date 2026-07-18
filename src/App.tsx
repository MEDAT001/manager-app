import { useCallback, useState } from 'react'
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

  const speakStreamRef = useCallback((sentence: string) => {
    voiceMode.speakTextStream(sentence)
  }, [voiceMode])

  const [lastReply, setLastReply] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const chat = useChat({
    onSentence: mode === 'conversation' && voiceMode.isVoiceMode
      ? (sentence) => {
          speakStreamRef(sentence)
        }
      : undefined,
    onReply: mode === 'conversation' && voiceMode.isVoiceMode
      ? (fullText) => {
          // Just display the reply, mic stays OFF until user clicks
          setLastReply(fullText)
          setIsThinking(false)
        }
      : undefined,
  })

  const sendMessageRef = useCallback((text: string) => {
    setIsThinking(false)
    setLastReply('')
    chat.sendMessage(text)
  }, [chat])

  const handleVoiceResult = useCallback((text: string) => {
    setIsThinking(true)
    setLastReply('')
    sendMessageRef(text)
  }, [sendMessageRef])

  const voice = useVoiceRecognition(handleVoiceResult)

  const handleSelectMode = useCallback((selected: 'chat' | 'conversation') => {
    setMode(selected)
    if (selected === 'conversation') {
      voiceMode.enable()
    }
  }, [voiceMode])

  const handleMicToggle = useCallback(() => {
    if (voice.isListening) {
      voice.stopListening()
    } else {
      setIsThinking(false)
      voice.startListening()
    }
  }, [voice])

  const handleBackToSelect = useCallback(() => {
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
