export const APP_NAME = 'Manager.app'

export const CREDITS = {
  INITIAL: 20,
  COST_TEXT: 1,
  COST_VOICE: 2,
} as const

export const API = {
  MODEL: 'google/gemini-2.5-flash-lite',
  MAX_TOKENS: 1024,
  TEMPERATURE: 0.8,
  TYPING_DELAY_MS: 40,
} as const

export const LIMITS = {
  MAX_MESSAGE_LENGTH: 2000,
} as const
