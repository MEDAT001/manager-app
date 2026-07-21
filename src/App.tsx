import { useCallback, useState, useEffect } from 'react'
import { RefreshCw, MoreHorizontal } from 'lucide-react'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { ConversationMode } from './components/ConversationMode'
import { SessionList } from './components/SessionList'
import { useChat } from './hooks/useChat'
import { useVoiceRecognition } from './hooks/useVoiceRecognition'
import { useVoiceMode } from './hooks/useVoiceMode'
import { loadSessions, createSession, deleteSession } from './lib/storage'
import type { Session } from './lib/storage'

type AppMode = 'list' | 'chat' | 'conversation'

export default function App() {
  const [mode, setMode] = useState<AppMode>('list')
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const voiceMode = useVoiceMode()

  // Load sessions on mount
  useEffect(() => {
    setSessions(loadSessions())
  }, [])

  const speakStreamRef = useCallback((sentence: string) => {
    voiceMode.speakTextStream(sentence)
  }, [voiceMode])

  const [lastReply, setLastReply] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const chat = useChat({
    sessionId: activeSession?.id ?? null,
    initialMessages: activeSession?.messages ?? [],
    onSentence: mode === 'conversation' && voiceMode.isVoiceMode
      ? (sentence) => {
          speakStreamRef(sentence)
        }
      : undefined,
    onReply: mode === 'conversation' && voiceMode.isVoiceMode
      ? (fullText) => {
          setLastReply(fullText)
          setIsThinking(false)
        }
      : undefined,
  })

  // Refresh sessions list when messages change
  useEffect(() => {
    if (activeSession && chat.messages.length > 0) {
      setSessions(loadSessions())
    }
  }, [chat.messages.length, activeSession])

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

  const createNewSession = useCallback((sessionMode: 'chat' | 'conversation') => {
    const session = createSession(sessionMode)
    setActiveSession(session)
    setSessions(loadSessions())
    if (sessionMode === 'conversation') {
      voiceMode.enable()
      setMode('conversation')
    } else {
      setMode('chat')
    }
  }, [voiceMode])

  const handleSelectSession = useCallback((session: Session) => {
    setActiveSession(session)
    if (session.mode === 'conversation') {
      voiceMode.enable()
      setMode('conversation')
    } else {
      setMode('chat')
    }
  }, [voiceMode])

  const handleDeleteSession = useCallback((sessionId: string) => {
    deleteSession(sessionId)
    setSessions(loadSessions())
    if (activeSession?.id === sessionId) {
      setActiveSession(null)
      setMode('list')
      chat.clearMessages()
    }
  }, [activeSession, chat])

  const handleMicToggle = useCallback(() => {
    if (voice.isListening) {
      voice.stopListening()
    } else {
      setIsThinking(false)
      voice.startListening()
    }
  }, [voice])

  const handleBackToList = useCallback(() => {
    chat.clearMessages()
    voiceMode.disable()
    if (voice.isListening) voice.stopListening()
    setActiveSession(null)
    setMode('list')
    setLastReply('')
    setIsThinking(false)
    setSessions(loadSessions())
  }, [chat, voiceMode, voice])

  const handleClearChat = useCallback(() => {
    chat.clearMessages()
    if (voice.isListening) voice.stopListening()
  }, [chat, voice])

  // Session list view
  if (mode === 'list') {
    return (
      <SessionList
        sessions={sessions}
        onSelect={handleSelectSession}
        onDelete={handleDeleteSession}
        onNewChat={() => createNewSession('chat')}
        onNewVoice={() => createNewSession('conversation')}
      />
    )
  }

  // Conversation mode (voice)
  if (mode === 'conversation') {
    return (
      <ConversationMode
        isSpeaking={voiceMode.isSpeaking}
        isListening={voice.isListening}
        isThinking={isThinking}
        transcription={voice.transcript}
        voiceError={voice.error}
        lastReply={lastReply}
        onBack={handleBackToList}
        onMicToggle={handleMicToggle}
      />
    )
  }

  // Chat mode
  return (
    <div className="h-full flex flex-col"
      style={{ background: 'linear-gradient(165deg, #0a0818 0%, #12101f 30%, #1a1635 60%, #0d0b1a 100%)' }}>
      <header className="flex items-center justify-between px-5 py-4 relative"
        style={{ background: 'rgba(10,8,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] overflow-hidden"
            style={{ boxShadow: '0 4px 16px rgba(212,175,55,0.15)' }}>
            <img src="/logo.png" alt="Coach" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-[15px] tracking-tight block leading-tight"
              style={{ color: '#FFF8E7' }}>
              Coach
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
              onClick={handleClearChat}
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
          <button
            onClick={handleBackToList}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ color: 'rgba(212,175,55,0.4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(212,175,55,0.4)'; e.currentTarget.style.background = 'transparent' }}
            aria-label="Retour aux conversations"
            title="Retour aux conversations"
          >
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
