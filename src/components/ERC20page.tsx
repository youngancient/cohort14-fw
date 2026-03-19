'use client'
import { useEffect, useRef } from 'react'
import ERC20Panel from './ERC20panel'
import CryptoTicker from './CryptoTicker'

export default function ERC20Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf: number

    const onResize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    /* ── gold light orbs ──
       Each orb is a slow-drifting radial gradient.
       They never move fast — always cinematic, breathing.
    */
    const GOLD_1 = 'rgba(212,175,55,'
    const GOLD_2 = 'rgba(255,200,80,'
    const GOLD_3 = 'rgba(180,130,20,'

    interface Orb {
      x: number; y: number          /* current position (0–1 normalized) */
      tx: number; ty: number        /* target position */
      vx: number; vy: number        /* velocity */
      r: number                     /* radius */
      alpha: number                 /* current opacity */
      talpha: number                /* target opacity */
      color: string
      speed: number
    }

    const orbs: Orb[] = [
      /* Large ambient orb — top left, barely moves */
      { x:0.15, y:0.18, tx:0.22, ty:0.25, vx:0, vy:0,
        r:0.55, alpha:0, talpha:0.18, color:GOLD_1, speed:0.00008 },
      /* Medium orb — center right, slow drift */
      { x:0.78, y:0.45, tx:0.70, ty:0.38, vx:0, vy:0,
        r:0.38, alpha:0, talpha:0.14, color:GOLD_2, speed:0.00012 },
      /* Small sharp orb — lower center, accent */
      { x:0.50, y:0.80, tx:0.45, ty:0.72, vx:0, vy:0,
        r:0.22, alpha:0, talpha:0.10, color:GOLD_3, speed:0.00015 },
      /* Thin streak — upper right */
      { x:0.85, y:0.12, tx:0.80, ty:0.20, vx:0, vy:0,
        r:0.28, alpha:0, talpha:0.09, color:GOLD_1, speed:0.00010 },
    ]

    let t = 0

    function drawOrb(orb: Orb) {
      const cx = orb.x * W
      const cy = orb.y * H
      const r  = orb.r * Math.max(W, H)

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0,   orb.color + (orb.alpha * 1.0).toFixed(3) + ')')
      grad.addColorStop(0.3, orb.color + (orb.alpha * 0.6).toFixed(3) + ')')
      grad.addColorStop(0.7, orb.color + (orb.alpha * 0.18).toFixed(3) + ')')
      grad.addColorStop(1,   orb.color + '0)')

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
    }

    /* Slow sinusoidal target updates — orbs drift like breathing light */
    function updateOrbTargets(orb: Orb, index: number) {
      const phase = t * orb.speed * 1000 + index * Math.PI * 0.7
      /* Each orb oscillates around its initial position very slowly */
      const bases = [
        { bx:0.15, by:0.18 },
        { bx:0.78, by:0.45 },
        { bx:0.50, by:0.80 },
        { bx:0.85, by:0.12 },
      ]
      const base = bases[index]
      orb.tx = base.bx + Math.sin(phase * 0.8)  * 0.12
      orb.ty = base.by + Math.cos(phase * 0.65) * 0.09
      /* Alpha breathes slowly */
      orb.talpha = bases[index === 0 ? 0 : index].by > 0.5
        ? 0.10 + Math.sin(phase * 1.2) * 0.05
        : 0.14 + Math.sin(phase * 0.9) * 0.06
    }

    /* Slow sweep light — a thin angled gradient that moves across the screen */
    function drawSweep() {
      /* Full cycle every ~12 seconds */
      const progress = (Math.sin(t * 0.00005 * Math.PI * 2) + 1) / 2
      const sweepX   = -W * 0.3 + progress * W * 1.6
      const sweepW   = W * 0.18

      const grad = ctx.createLinearGradient(sweepX, 0, sweepX + sweepW, H)
      grad.addColorStop(0,   'rgba(212,175,55,0)')
      grad.addColorStop(0.4, 'rgba(212,175,55,0.028)')
      grad.addColorStop(0.5, 'rgba(255,210,90,0.045)')
      grad.addColorStop(0.6, 'rgba(212,175,55,0.028)')
      grad.addColorStop(1,   'rgba(212,175,55,0)')

      ctx.save()
      /* Slight angle — not perfectly vertical, feels more organic */
      ctx.transform(1, 0, -0.15, 1, 0, 0)
      ctx.fillStyle = grad
      ctx.fillRect(sweepX - sweepW, 0, sweepW * 3, H)
      ctx.restore()
    }

    /* Top edge gold rim — static but glows subtly */
    function drawRim() {
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0,    'rgba(212,175,55,0)')
      grad.addColorStop(0.25, 'rgba(212,175,55,0.35)')
      grad.addColorStop(0.5,  'rgba(255,210,80,0.55)')
      grad.addColorStop(0.75, 'rgba(212,175,55,0.35)')
      grad.addColorStop(1,    'rgba(212,175,55,0)')

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, 1.5)
    }

    let last = 0
    function loop(ts: number) {
      const dt = ts - last
      last = ts
      t   += dt

      ctx.clearRect(0, 0, W, H)

      /* Black base */
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)

      /* Update and draw orbs */
      orbs.forEach((orb, i) => {
        updateOrbTargets(orb, i)
        /* Lerp position — very slow */
        orb.x     += (orb.tx - orb.x)     * 0.004
        orb.y     += (orb.ty - orb.y)     * 0.004
        orb.alpha += (orb.talpha - orb.alpha) * 0.006
        drawOrb(orb)
      })

      drawSweep()
      drawRim()

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(ts => { last = ts; raf = requestAnimationFrame(loop) })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="w-full relative" style={{ background: '#000000' }}>

      {/* Gold light canvas — fills entire viewport behind everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Very subtle noise grain texture over the canvas */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      {/* Connect Wallet button */}
      <button
        className="fixed top-5 right-7 z-40 flex items-center gap-2 font-['DM_Mono'] text-[9px] tracking-[0.28em] uppercase transition-all duration-[350ms]"
        style={{
          padding: '8px 18px',
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.45)',
          color: '#d4af37',
          textShadow: '0 0 10px rgba(212,175,55,0.5)',
          clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))',
          boxShadow: '0 0 14px rgba(212,175,55,0.07), inset 0 0 14px rgba(212,175,55,0.03)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor  = 'rgba(212,175,55,0.9)'
          el.style.color        = '#f0c040'
          el.style.textShadow   = '0 0 20px rgba(212,175,55,1)'
          el.style.background   = 'rgba(212,175,55,0.05)'
          el.style.boxShadow    = '0 0 28px rgba(212,175,55,0.18), inset 0 0 18px rgba(212,175,55,0.06)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor  = 'rgba(212,175,55,0.45)'
          el.style.color        = '#d4af37'
          el.style.textShadow   = '0 0 10px rgba(212,175,55,0.5)'
          el.style.background   = 'transparent'
          el.style.boxShadow    = '0 0 14px rgba(212,175,55,0.07), inset 0 0 14px rgba(212,175,55,0.03)'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#d4af37',
            boxShadow: '0 0 6px #d4af37',
            animation: 'gemPulse 2.4s ease-in-out infinite',
          }}
        />
        Connect Wallet
      </button>

      {/* Main content — above canvas */}
      <div className="relative z-20 w-full">
        <ERC20Panel visible={true} />
        <CryptoTicker />
      </div>

      <style>{`
        @keyframes gemPulse {
          0%,100% { box-shadow: 0 0 5px rgba(212,175,55,0.6); opacity: 0.85; }
          50%      { box-shadow: 0 0 14px rgba(212,175,55,1), 0 0 28px rgba(212,175,55,0.35); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
