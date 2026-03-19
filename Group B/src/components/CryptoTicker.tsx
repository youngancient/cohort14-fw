import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COINS = [
  { sym: 'BTC',  name: 'Bitcoin',   icon: '₿',  price: 67842.50, change: +2.34 },
  { sym: 'ETH',  name: 'Ethereum',  icon: 'Ξ',  price: 3521.18,  change: +1.87 },
  { sym: 'BNB',  name: 'BNB',       icon: '◈',  price: 412.65,   change: -0.52 },
  { sym: 'SOL',  name: 'Solana',    icon: '◎',  price: 182.44,   change: +5.21 },
  { sym: 'XRP',  name: 'Ripple',    icon: '✦',  price: 0.6284,   change: +0.93 },
  { sym: 'ADA',  name: 'Cardano',   icon: '⬡',  price: 0.4851,   change: -1.14 },
  { sym: 'AVAX', name: 'Avalanche', icon: '▲',  price: 38.72,    change: +3.66 },
  { sym: 'DOT',  name: 'Polkadot',  icon: '●',  price: 7.43,     change: -0.28 },
  { sym: 'LINK', name: 'Chainlink', icon: '⬢',  price: 14.92,    change: +2.10 },
  { sym: 'MATIC',name: 'Polygon',   icon: '◆',  price: 0.8817,   change: +1.45 },
  { sym: 'UNI',  name: 'Uniswap',   icon: '⟠',  price: 9.31,     change: -0.87 },
  { sym: 'ARB',  name: 'Arbitrum',  icon: '◉',  price: 1.124,    change: +4.33 },
]

function fmt(p: number): string {
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (p >= 1)    return '$' + p.toFixed(2)
  return '$' + p.toFixed(4)
}

export default function CryptoTicker() {
  const trackRef  = useRef<HTMLDivElement>(null)
  const coinsRef  = useRef([...COINS.map(c => ({ ...c }))])
  const pausedRef = useRef(false)
  const posRef    = useRef(0)
  const lastTRef  = useRef(performance.now())

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // build dom — two copies for seamless loop
    track.innerHTML = ''
    for (let copy = 0; copy < 2; copy++) {
      coinsRef.current.forEach((coin, i) => {
        const up   = coin.change >= 0
        const card = document.createElement('div')
        card.className   = 'inline-flex items-center gap-[10px] px-8 border-r border-[rgba(212,175,55,0.15)] flex-shrink-0'
        card.dataset.sym = coin.sym
        card.innerHTML = `
          <div class="text-[18px] leading-none" style="filter:drop-shadow(0 0 4px rgba(212,175,55,0.5))">${coin.icon}</div>
          <div class="flex flex-col gap-[1px]">
            <div class="text-[15px] tracking-[0.14em] font-['Bebas_Neue'] text-[#c9a227]" style="text-shadow:0 0 12px rgba(212,175,55,0.4)">${coin.sym}</div>
            <div class="text-[7.5px] tracking-[0.2em] uppercase text-[rgba(160,128,40,0.7)] font-['DM_Mono']">${coin.name}</div>
          </div>
          <div class="flex flex-col gap-[2px] items-end">
            <div class="text-[17px] tracking-[0.06em] font-['Bebas_Neue'] coin-price text-[#d4af37]" data-price="${coin.price}" style="text-shadow:0 0 16px rgba(212,175,55,0.35)">${fmt(coin.price)}</div>
            <div class="text-[9px] tracking-[0.12em] font-['DM_Mono'] font-medium flex items-center gap-[2px] ${up ? 'text-[#c9a227]' : 'text-[#8b6914]'}">${up ? '▲' : '▼'} ${Math.abs(coin.change).toFixed(2)}%</div>
          </div>`
        track.appendChild(card)
        if (i < coinsRef.current.length - 1 || copy === 0) {
          const sep = document.createElement('span')
          sep.className   = 'text-[8px] px-[6px] flex-shrink-0 text-[rgba(212,175,55,0.3)]'
          sep.textContent = '◆'
          track.appendChild(sep)
        }
      })
    }

    // scroll
    const halfW = () => track.scrollWidth / 2
    let raf: number
    const scroll = (now: number) => {
      raf = requestAnimationFrame(scroll)
      if (pausedRef.current) { lastTRef.current = now; return }
      posRef.current += 55 * (now - lastTRef.current) / 1000
      lastTRef.current = now
      if (posRef.current >= halfW()) posRef.current -= halfW()
      track.style.transform = `translateX(${-posRef.current}px)`
    }
    raf = requestAnimationFrame(scroll)

    // drift prices
    let driftTimeout: ReturnType<typeof setTimeout>
    const drift = () => {
      const idx  = Math.floor(Math.random() * coinsRef.current.length)
      const coin = coinsRef.current[idx]
      coin.price  = Math.max(0.0001, coin.price * (1 + (Math.random() * 0.003 - 0.0015)))
      coin.change += Math.random() * 0.06 - 0.03
      document.querySelectorAll<HTMLElement>(`.coin-price[data-price]`).forEach((el, i) => {
        if (i % coinsRef.current.length === idx) {
          el.textContent = fmt(coin.price)
          gsap.fromTo(el,
            { color: '#fffde0', textShadow: '0 0 28px rgba(255,240,80,1)' },
            { color: '#d4af37', textShadow: '0 0 16px rgba(212,175,55,0.35)', duration: 1, ease: 'power2.out' }
          )
        }
      })
      driftTimeout = setTimeout(drift, 3000 + Math.random() * 5000)
    }
    driftTimeout = setTimeout(drift, 2000)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(driftTimeout)
    }
  }, [])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-[52px] flex items-center overflow-hidden border-t hidden md:flex"
      style={{ 
        background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.18) 100%)',
        borderColor: 'rgba(212,175,55,0.22)'
      }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* fade masks */}
      <div className="absolute top-0 bottom-0 left-0 w-20 z-[2] pointer-events-none"
           style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.92),transparent)' }} />
      <div className="absolute top-0 bottom-0 right-0 w-20 z-[2] pointer-events-none"
           style={{ background: 'linear-gradient(270deg,rgba(255,255,255,0.92),transparent)' }} />

      <div
        ref={trackRef}
        className="flex items-center gap-0 whitespace-nowrap will-change-transform"
      />
    </div>
  )
}