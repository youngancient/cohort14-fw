'use client'
import ERC20Panel from './ERC20panel'
import CryptoTicker from './CryptoTicker'

export default function ERC20Page() {
  return (
    <div className="w-full h-full overflow-hidden bg-white">
      <video
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-0 transition-opacity duration-[600ms]"
        src="waves.mp4"
        autoPlay loop muted playsInline
        onCanPlay={e => { (e.currentTarget as HTMLVideoElement).style.opacity = '1' }}
        onError={e => { (e.currentTarget as HTMLVideoElement).remove() }}
      />
      <button
        className="fixed top-5 right-7 z-[100] flex items-center gap-2 font-['DM_Mono'] text-[9px] tracking-[0.28em] uppercase transition-all duration-[250ms]"
        style={{
          padding: '8px 18px',
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.5)',
          color: '#d4af37',
          textShadow: '0 0 10px rgba(212,175,55,0.5)',
          clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))',
          boxShadow: '0 0 12px rgba(212,175,55,0.08), inset 0 0 12px rgba(212,175,55,0.03)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(212,175,55,0.9)'
          el.style.color       = '#f0c040'
          el.style.textShadow  = '0 0 18px rgba(212,175,55,0.9)'
          el.style.background  = 'rgba(212,175,55,0.04)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(212,175,55,0.5)'
          el.style.color       = '#d4af37'
          el.style.textShadow  = '0 0 10px rgba(212,175,55,0.5)'
          el.style.background  = 'transparent'
        }}
      >
        Connect Wallet
      </button>
      <ERC20Panel visible={true} />
      <CryptoTicker />

      <style>{`
        @keyframes gemPulse {
          0%,100% { box-shadow: 0 0 6px rgba(212,175,55,0.7); }
          50%     { box-shadow: 0 0 14px rgba(212,175,55,1), 0 0 24px rgba(212,175,55,0.4); }
        }
      `}</style>
    </div>
  )
}