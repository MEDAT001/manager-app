import { useState, useCallback } from 'react'
import { CREDITS } from '../lib/constants'
import { logger } from '../lib/logger'

export function useCredits() {
  const [remaining, setRemaining] = useState<number>(CREDITS.INITIAL)

  const consume = useCallback((type: 'text' | 'voice' = 'text') => {
    const cost = type === 'voice' ? CREDITS.COST_VOICE : CREDITS.COST_TEXT
    setRemaining((prev) => {
      const next = Math.max(0, prev - cost)
      if (next <= 3) logger.warn('Crédits bas', { remaining: next })
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setRemaining(CREDITS.INITIAL)
    logger.info('Crédits réinitialisés')
  }, [])

  const canAfford = useCallback(
    (type: 'text' | 'voice' = 'text') => {
      const cost = type === 'voice' ? CREDITS.COST_VOICE : CREDITS.COST_TEXT
      return remaining >= cost
    },
    [remaining],
  )

  return { remaining, total: CREDITS.INITIAL, consume, reset, canAfford }
}
