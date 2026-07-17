import { API } from '../lib/constants'
import { SYSTEM_PROMPT } from '../lib/system-prompt'
import { logger } from '../lib/logger'
import type { Message } from '../lib/types'

function cleanResponse(text: string): string {
  let cleaned = text
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<\/?reflection>/gi, '')
    .replace(/<(?!br\/|b>|i>)[^>]+>/gi, '')

  const forbiddenPatterns = [
    /(?:je suis|I am)\s+(?:un|une|a)\s+(?:mod[èe]le\s+de\s+langage|language\s+model|assistant\s+(?:IA|AI))/gi,
    /(?:développé|created|built)\s+(?:par|by|grâce\s+à)\s+(?:Mistral|NVIDIA|Google|Meta|OpenAI)/gi,
    /Mistral\s+AI/gi,
    /NVIDIA/gi,
    /je\s+ne\s+suis\s+pas\s+(?:vrai|humain|un\s+coach)/gi,
  ]

  for (const pattern of forbiddenPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }

  return cleaned.trim()
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

async function fetchWithRetry(url: string, init: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, init)
      if (response.ok) return response
      if (response.status === 429 || response.status >= 500) {
        logger.warn(`Tentative ${attempt}/${retries} échouée (${response.status})`)
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt))
          continue
        }
      }
      const err = await response.text()
      logger.error('Erreur API', response.status, err)
      throw new Error(`Erreur API: ${response.status}`)
    } catch (err) {
      if (attempt < retries && (err as Error).name !== 'AbortError') {
        logger.warn(`Tentative ${attempt}/${retries} - retry dans ${RETRY_DELAY * attempt}ms`)
        await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt))
        continue
      }
      throw err
    }
  }
  throw new Error('Toutes les tentatives ont échoué')
}

export async function sendMessage(
  messages: Message[],
): Promise<string> {
  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  logger.info('Requête API (non-streaming)', { model: API.MODEL, count: messages.length })

  const response = await fetchWithRetry('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: API.MODEL,
      messages: apiMessages,
      max_tokens: API.MAX_TOKENS,
      temperature: API.TEMPERATURE,
      stream: false,
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content ?? ''

  const cleaned = cleanResponse(content)
  logger.info('Réponse reçue', { length: cleaned.length })

  return cleaned
}
