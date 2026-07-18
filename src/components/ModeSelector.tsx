

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
          <stop stopColor="#D4AF37"/>
          <stop offset="0.5" stopColor="#F5D67B"/>
          <stop offset="1" stopColor="#C9A84C"/>
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
          <stop stopColor="#D4AF37"/>
          <stop offset="0.5" stopColor="#F5D67B"/>
          <stop offset="1" stopColor="#C9A84C"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #0a0818 0%, #12101f 30%, #1a1635 60%, #0d0b1a 100%)' }}>

      {/* Subtle gold radial accents */}
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px] top-[-150px] left-[-100px]"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[120px] bottom-[-100px] right-[-80px]"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

      {/* Decorative gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #D4AF37, transparent)' }} />

      <div className="relative z-10 text-center" style={{ animation: 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Logo with gold frame */}
        <div className="relative w-[110px] h-[110px] mx-auto mb-10">
          <div className="absolute inset-[-3px] rounded-[36px] opacity-60"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F5D67B, #C9A84C, #D4AF37)', padding: '2px' }}>
            <div className="w-full h-full rounded-[34px]" style={{ background: '#0a0818' }} />
          </div>
          <div className="relative w-full h-full rounded-[34px] overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2), 0 0 80px rgba(212, 175, 55, 0.05)' }}>
            <img src="/logo.png" alt="Manager Pro" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-4 block"
            style={{ color: '#C9A84C' }}>
            Votre coach personnel
          </span>
        </div>
        <h1 className="text-[34px] font-[800] tracking-[-0.03em] mb-3"
          style={{ color: '#FFF8E7' }}>
          Bonjour, je suis <span style={{
            background: 'linear-gradient(135deg, #D4AF37, #F5D67B, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Samir</span>.
        </h1>
        <p className="text-[15px] font-medium mb-14" style={{ color: 'rgba(255,248,231,0.35)' }}>
          Coach de management pour l'hôtellerie
        </p>

        {/* Mode cards */}
        <div className="flex gap-5 max-w-[440px] w-full px-6">
          <button
            onClick={() => onSelect('chat')}
            className="flex-1 p-8 rounded-[24px] text-center cursor-pointer transition-all duration-500 hover:-translate-y-1.5 group relative overflow-hidden"
            style={{
              border: '1px solid rgba(212,175,55,0.12)',
              background: 'rgba(212,175,55,0.03)',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
              e.currentTarget.style.background = 'rgba(212,175,55,0.08)'
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(212,175,55,0.12), inset 0 1px 0 rgba(245,214,123,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'
              e.currentTarget.style.background = 'rgba(212,175,55,0.03)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))' }}>
              <GoldChatIcon />
            </div>
            <span className="font-bold text-[17px] block mb-1.5"
              style={{ color: '#FFF8E7' }}>Chat</span>
            <span className="text-[12px] leading-snug block"
              style={{ color: 'rgba(255,248,231,0.35)' }}>
              Écris et lis les réponses
            </span>
          </button>

          <button
            onClick={() => onSelect('conversation')}
            className="flex-1 p-8 rounded-[24px] text-center cursor-pointer transition-all duration-500 hover:-translate-y-1.5 group relative overflow-hidden"
            style={{
              border: '1px solid rgba(212,175,55,0.12)',
              background: 'rgba(212,175,55,0.03)',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
              e.currentTarget.style.background = 'rgba(212,175,55,0.08)'
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(212,175,55,0.12), inset 0 1px 0 rgba(245,214,123,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'
              e.currentTarget.style.background = 'rgba(212,175,55,0.03)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))' }}>
              <GoldMicIcon />
            </div>
            <span className="font-bold text-[17px] block mb-1.5"
              style={{ color: '#FFF8E7' }}>Conversation</span>
            <span className="text-[12px] leading-snug block"
              style={{ color: 'rgba(255,248,231,0.35)' }}>
              Parle et écoute Samir
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
