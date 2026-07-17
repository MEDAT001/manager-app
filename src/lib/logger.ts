type LogLevel = 'info' | 'warn' | 'error'

const LEVEL: LogLevel = import.meta.env.DEV ? 'info' : 'error'

export const logger = {
  info: (...args: unknown[]) =>
    LEVEL === 'info' && console.log('[Manager]', ...args),

  warn: (...args: unknown[]) =>
    ['info', 'warn'].includes(LEVEL) && console.warn('[Manager]', ...args),

  error: (...args: unknown[]) =>
    console.error('[Manager]', ...args),
}
