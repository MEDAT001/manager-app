export function OrbAnimation({ size = 40 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-2xl animate-orb"
        style={{ background: 'radial-gradient(circle, rgba(255,107,157,0.15) 0%, rgba(108,99,255,0.1) 100%)' }}
      />
      <div
        className="absolute inset-1 rounded-xl animate-orb [animation-delay:0.3s]"
        style={{ background: 'radial-gradient(circle, rgba(255,107,157,0.25) 0%, rgba(108,99,255,0.15) 100%)', animationDuration: '2.2s' }}
      />
      <div
        className="absolute inset-2.5 rounded-lg animate-orb [animation-delay:0.6s]"
        style={{ background: 'radial-gradient(circle, rgba(255,107,157,0.4) 0%, rgba(108,99,255,0.3) 100%)', animationDuration: '1.8s' }}
      />
    </div>
  )
}
