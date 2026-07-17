import { Zap } from 'lucide-react'

interface Props {
  remaining: number
  total: number
}

export function CreditCounter({ remaining, total }: Props) {
  const ratio = remaining / total
  const isLow = ratio <= 0.2
  const isCritical = ratio <= 0.1

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
        isCritical
          ? 'bg-danger/10 text-danger animate-pulse'
          : isLow
            ? 'bg-warning/10 text-warning'
            : 'bg-accent/10 text-accent'
      }`}
    >
      <Zap size={14} className={isCritical ? 'text-danger' : ''} />
      <span>{remaining}</span>
      <span className="text-text-muted">/ {total}</span>
    </div>
  )
}
