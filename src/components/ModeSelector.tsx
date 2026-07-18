

interface Props {
  onSelect: (mode: 'chat' | 'conversation') => void
}

function GoldChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="url(#gold1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="11.5" r="1" fill="url(#gold1)"/>
      <circle cx="8" cy="11.5" r="1" fill="url(#gold1)"/>
      <circle cx="16" cy="11.5" r="1" fill="url(#gold1)"/>
      <defs>
        <linearGradient id="gold1" x1="3" y1="3" x2="21" y2="21">
          <stop stopColor="#C9A96E"/>
          <stop offset="0.5" stopColor="#E8D5A3"/>
          <stop offset="1" stopColor="#A67C52"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function GoldMicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="url(#gold2)" strokeWidth="1.5"/>
      <path d="M5 10a7 7 0 0 0 14 0" stroke="url(#gold2)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="url(#gold2)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="21" x2="15" y2="21" stroke="url(#gold2)" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="gold2" x1="5" y1="2" x2="19" y2="21">
          <stop stopColor="#C9A96E"/>
          <stop offset="0.5" stopColor="#E8D5A3"/>
          <stop offset="1" stopColor="#A67C52"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: '#0C0A09' }}>

      {/* Warm gold ambient glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.035] blur-[150px] top-[-200px] left-[-150px]"
        style={{ background: 'radial-gradient(circle, #C9A96E, transparent)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.025] blur-[150px] bottom-[-150px] right-[-100px]"
        style={{ background: 'radial-gradient(circle, #A67C52, transparent)' }} />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,169,110,0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Top gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #C9A96E, transparent)' }} />

      <div className="relative z-10 text-center" style={{ animation: 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Logo */}
        <div className="relative w-[100px] h-[100px] mx-auto mb-8">
          <div className="absolute inset-[-2px] rounded-[32px] opacity-40"
            style={{ background: 'linear-gradient(135deg, #C9A96E, #E8D5A3, #A67C52, #C9A96E)' }}>
            <div className="w-full h-full rounded-[30px]" style={{ background: '#0C0A09' }} />
          </div>
          <div className="relative w-full h-full rounded-[30px] overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(201,169,110,0.15)' }}>
            <img src="/logo.png" alt="Manager Pro" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Subtitle */}
        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase block mb-4"
          style={{ color: '#A67C52' }}>
          Coach Premium
        </span>

        {/* Title */}
        <h1 className="text-[32px] font-[800] tracking-[-0.02em] mb-2"
          style={{ color: '#F5F0E8' }}>
          Bonjour, je suis <span style={{
            background: 'linear-gradient(135deg, #C9A96E, #E8D5A3, #A67C52)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Samir</span>.
        </h1>
        <p className="text-[14px] font-medium mb-12" style={{ color: 'rgba(245,240,232,0.3)' }}>
          Coach de management pour l'hôtellerie
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12 px-8">
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.2))' }} />
          <span className="text-[9px] font-semibold tracking-[0.3em] uppercase" style={{ color: 'rgba(166,124,82,0.4)' }}>Choisir</span>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.2), transparent)' }} />
        </div>

        {/* Cards */}
        <div className="flex gap-4 max-w-[400px] w-full px-4">
          <button
            onClick={() => onSelect('chat')}
            className="flex-1 p-7 rounded-[20px] text-center cursor-pointer transition-all duration-500 hover:-translate-y-1"
            style={{
              border: '1px solid rgba(201,169,110,0.08)',
              background: 'rgba(201,169,110,0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'
              e.currentTarget.style.background = 'rgba(201,169,110,0.06)'
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(201,169,110,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.08)'
              e.currentTarget.style.background = 'rgba(201,169,110,0.02)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.08)' }}>
              <GoldChatIcon />
            </div>
            <span className="font-bold text-[16px] block mb-1" style={{ color: '#F5F0E8' }}>Chat</span>
            <span className="text-[11px] leading-snug block" style={{ color: 'rgba(245,240,232,0.3)' }}>
              Écris et lis les réponses
            </span>
          </button>

          <button
            onClick={() => onSelect('conversation')}
            className="flex-1 p-7 rounded-[20px] text-center cursor-pointer transition-all duration-500 hover:-translate-y-1"
            style={{
              border: '1px solid rgba(201,169,110,0.08)',
              background: 'rgba(201,169,110,0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'
              e.currentTarget.style.background = 'rgba(201,169,110,0.06)'
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(201,169,110,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.08)'
              e.currentTarget.style.background = 'rgba(201,169,110,0.02)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.08)' }}>
              <GoldMicIcon />
            </div>
            <span className="font-bold text-[16px] block mb-1" style={{ color: '#F5F0E8' }}>Conversation</span>
            <span className="text-[11px] leading-snug block" style={{ color: 'rgba(245,240,232,0.3)' }}>
              Parle et écoute Samir
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
