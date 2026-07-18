import { MessageSquare, Mic } from 'lucide-react'

interface Props {
  onSelect: (mode: 'chat' | 'conversation') => void
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #0f0c29 0%, #1a1145 35%, #24243e 100%)' }}>

      {/* Background orbs */}
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[100px] -top-20 -left-16"
        style={{ background: '#6C63FF', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute w-[250px] h-[250px] rounded-full opacity-20 blur-[100px] -bottom-16 -right-10"
        style={{ background: '#FF6B9D', animation: 'float 8s ease-in-out infinite 3s' }} />
      <div className="absolute w-[180px] h-[180px] rounded-full opacity-10 blur-[100px] top-[40%] right-[10%]"
        style={{ background: '#43E97B', animation: 'float 8s ease-in-out infinite 5s' }} />

      <div className="relative z-10 text-center" style={{ animation: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Logo */}
        <div className="w-[100px] h-[100px] rounded-[32px] overflow-hidden mx-auto mb-8 shadow-2xl"
          style={{ boxShadow: '0 20px 60px rgba(108, 99, 255, 0.4), 0 0 0 1px rgba(255,255,255,0.1)' }}>
          <img src="/logo.png" alt="Manager Pro" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-[32px] font-[800] text-white tracking-[-0.03em] mb-3">
          Bonjour, je suis <span className="text-[#6C63FF]">Samir</span>.
        </h1>
        <p className="text-[15px] font-medium mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Ton coach de management personnel
        </p>

        {/* Mode cards */}
        <div className="flex gap-4 max-w-[420px] w-full px-6">
          <button
            onClick={() => onSelect('chat')}
            className="flex-1 p-7 rounded-[24px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'
              e.currentTarget.style.background = 'rgba(108,99,255,0.08)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(108,99,255,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(108,99,255,0.1))' }}>
              <MessageSquare size={24} className="text-[#8B83FF]" />
            </div>
            <span className="font-bold text-white text-[16px] block mb-1.5">Chat</span>
            <span className="text-[12px] leading-snug block" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Écris et lis les réponses
            </span>
          </button>

          <button
            onClick={() => onSelect('conversation')}
            className="flex-1 p-7 rounded-[24px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,107,157,0.3)'
              e.currentTarget.style.background = 'rgba(255,107,157,0.08)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,107,157,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(255,107,157,0.1))' }}>
              <Mic size={24} className="text-[#FF8FB8]" />
            </div>
            <span className="font-bold text-white text-[16px] block mb-1.5">Conversation</span>
            <span className="text-[12px] leading-snug block" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Parle et écoute Samir
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
