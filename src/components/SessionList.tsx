import { Trash2, MessageCircle, Mic } from 'lucide-react'
import type { Session } from '../lib/storage'

interface Props {
  sessions: Session[]
  onSelect: (session: Session) => void
  onDelete: (sessionId: string) => void
  onNewChat: () => void
  onNewVoice: () => void
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function SessionList({ sessions, onSelect, onDelete, onNewChat, onNewVoice }: Props) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden"
      style={{ background: '#0C0A09' }}>

      <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.035] blur-[150px] top-[-200px] left-[-150px]"
        style={{ background: 'radial-gradient(circle, #C9A96E, transparent)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.025] blur-[150px] bottom-[-150px] right-[-100px]"
        style={{ background: 'radial-gradient(circle, #A67C52, transparent)' }} />

      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,169,110,0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 relative z-10"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
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
      </header>

      {/* New conversation buttons */}
      <div className="px-5 pt-5 pb-3 relative z-10">
        <div className="flex gap-3">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-0.5"
            style={{
              border: '1px solid rgba(201,169,110,0.15)',
              background: 'linear-gradient(135deg, rgba(201,169,110,0.08), rgba(201,169,110,0.03))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,169,110,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <MessageCircle size={18} style={{ color: '#D4B97A' }} />
            <span className="text-[13px] font-semibold" style={{ color: '#F5F0E8' }}>
              Nouveau texte
            </span>
          </button>

          <button
            onClick={onNewVoice}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-0.5"
            style={{
              border: '1px solid rgba(201,169,110,0.15)',
              background: 'linear-gradient(135deg, rgba(201,169,110,0.08), rgba(201,169,110,0.03))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,169,110,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <Mic size={18} style={{ color: '#D4B97A' }} />
            <span className="text-[13px] font-semibold" style={{ color: '#F5F0E8' }}>
              Nouvel appel
            </span>
          </button>
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 relative z-10">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <MessageCircle size={40} style={{ color: '#D4B97A' }} className="mb-4 opacity-30" />
            <p className="text-sm text-center" style={{ color: 'rgba(245,240,232,0.5)' }}>
              Aucune conversation pour l'instant.
            </p>
            <p className="text-xs mt-1 text-center" style={{ color: 'rgba(245,240,232,0.3)' }}>
              Commence une nouvelle session ci-dessus.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="group flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300"
                style={{
                  border: '1px solid rgba(201,169,110,0.05)',
                  background: 'rgba(201,169,110,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)'
                  e.currentTarget.style.background = 'rgba(201,169,110,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.05)'
                  e.currentTarget.style.background = 'rgba(201,169,110,0.02)'
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.08)' }}
                >
                  {session.mode === 'conversation' ? (
                    <Mic size={14} style={{ color: '#D4B97A' }} />
                  ) : (
                    <MessageCircle size={14} style={{ color: '#D4B97A' }} />
                  )}
                </div>

                <button
                  onClick={() => onSelect(session)}
                  className="flex-1 text-left min-w-0"
                >
                  <span className="block text-[13px] font-semibold truncate"
                    style={{ color: '#F5F0E8' }}>
                    {session.title}
                  </span>
                  <span className="block text-[11px] mt-0.5"
                    style={{ color: 'rgba(245,240,232,0.3)' }}>
                    {formatDate(session.updatedAt)} · {session.messages.length} messages
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(session.id)
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/10"
                  style={{ color: 'rgba(255,87,87,0.5)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5757' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,87,87,0.5)' }}
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 relative z-10">
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase block text-center"
          style={{ color: '#D4B97A', fontFamily: "'Cormorant Garamond', serif", opacity: 0.5 }}>
          Version beta
        </span>
      </div>
    </div>
  )
}
