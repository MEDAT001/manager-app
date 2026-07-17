export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface CreditState {
  remaining: number
  total: number
}

export interface VoiceState {
  isListening: boolean
  transcript: string
  isSupported: boolean
}
