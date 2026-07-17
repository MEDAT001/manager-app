interface OrbProps {
  size?: number
  isActive?: boolean
  isListening?: boolean
  isSpeaking?: boolean
}

export function OrbAnimation({ size = 160, isActive = false, isListening = false, isSpeaking = false }: OrbProps) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isActive ? 'active' : 'idle'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${
            state === 'speaking'
              ? 'rgba(108,99,255,0.3) 0%, rgba(255,107,157,0.2) 40%, transparent 70%'
              : state === 'listening'
                ? 'rgba(255,107,155,0.25) 0%, rgba(255,154,118,0.15) 40%, transparent 70%'
                : 'rgba(108,99,255,0.15) 0%, rgba(139,131,255,0.08) 40%, transparent 70%'
          })`,
          transform: state === 'speaking' ? 'scale(1.3)' : state === 'listening' ? 'scale(1.15)' : 'scale(1)',
          animation: state === 'speaking' ? 'orb-glow-speaking 1.5s ease-in-out infinite' : 
                     state === 'listening' ? 'orb-glow-listening 2s ease-in-out infinite' : 'none',
        }}
      />

      {/* Layer 3 - outermost, slowest */}
      <div
        className="absolute rounded-full orb-layer-3"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          background: state === 'speaking'
            ? 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,107,157,0.1), rgba(79,172,254,0.12))'
            : state === 'listening'
              ? 'linear-gradient(135deg, rgba(255,107,155,0.12), rgba(255,154,118,0.1), rgba(108,99,255,0.1))'
              : 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(139,131,255,0.06))',
          animation: `orb-morph-1 ${state === 'speaking' ? '3s' : '5s'} ease-in-out infinite`,
          filter: 'blur(1px)',
        }}
      />

      {/* Layer 2 - middle */}
      <div
        className="absolute rounded-full orb-layer-2"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          background: state === 'speaking'
            ? 'linear-gradient(225deg, rgba(255,107,157,0.25), rgba(108,99,255,0.2), rgba(255,154,118,0.15))'
            : state === 'listening'
              ? 'linear-gradient(225deg, rgba(255,154,118,0.2), rgba(255,107,155,0.18), rgba(108,99,255,0.12))'
              : 'linear-gradient(225deg, rgba(139,131,255,0.15), rgba(108,99,255,0.12))',
          animation: `orb-morph-2 ${state === 'speaking' ? '2.5s' : '4s'} ease-in-out infinite`,
          filter: 'blur(0.5px)',
        }}
      />

      {/* Layer 1 - innermost, fastest */}
      <div
        className="absolute rounded-full orb-layer-1"
        style={{
          width: size * 0.58,
          height: size * 0.58,
          background: state === 'speaking'
            ? 'linear-gradient(315deg, rgba(108,99,255,0.5), rgba(255,107,157,0.4), rgba(79,172,254,0.35))'
            : state === 'listening'
              ? 'linear-gradient(315deg, rgba(255,107,155,0.45), rgba(255,154,118,0.35), rgba(108,99,255,0.3))'
              : 'linear-gradient(315deg, rgba(108,99,255,0.35), rgba(139,131,255,0.25))',
          animation: `orb-morph-3 ${state === 'speaking' ? '2s' : '3.5s'} ease-in-out infinite`,
        }}
      />

      {/* Core - bright center */}
      <div
        className="absolute rounded-full orb-core"
        style={{
          width: size * 0.32,
          height: size * 0.32,
          background: state === 'speaking'
            ? 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(108,99,255,0.6), rgba(255,107,157,0.4))'
            : state === 'listening'
              ? 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,107,155,0.5), rgba(255,154,118,0.3))'
              : 'radial-gradient(circle, rgba(255,255,255,0.7), rgba(139,131,255,0.4))',
          animation: `orb-core-pulse ${state === 'speaking' ? '1s' : '2.5s'} ease-in-out infinite`,
          boxShadow: state === 'speaking'
            ? '0 0 30px rgba(108,99,255,0.5), 0 0 60px rgba(255,107,157,0.3)'
            : state === 'listening'
              ? '0 0 20px rgba(255,107,155,0.4), 0 0 40px rgba(255,154,118,0.2)'
              : '0 0 15px rgba(139,131,255,0.3)',
        }}
      />
    </div>
  )
}
