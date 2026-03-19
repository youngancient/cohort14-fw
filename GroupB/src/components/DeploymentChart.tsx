import { useEffect, useRef, useState } from 'react'

const data = [
  { month: 'Oct', year: '24', count: 1,  cumulative: 1  },
  { month: 'Nov', year: '24', count: 2,  cumulative: 3  },
  { month: 'Dec', year: '24', count: 1,  cumulative: 4  },
  { month: 'Jan', year: '25', count: 4,  cumulative: 8  },
  { month: 'Feb', year: '25', count: 3,  cumulative: 11 },
  { month: 'Mar', year: '25', count: 5,  cumulative: 16 },
]

const STATS = [
  { label: 'Total Deployed',   value: '16'   },
  { label: 'Peak Month',       value: 'Mar'  },
  { label: 'Avg / Month',      value: '2.7'  },
  { label: 'Growth',           value: '+400%'},
]

export default function DeploymentChart() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const activeRef   = useRef<number | null>(null)

  useEffect(() => { activeRef.current = activeIdx }, [activeIdx])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1

    let W = 0, H = 0
    const setSize = () => {
      W = canvas.parentElement?.offsetWidth ?? 700
      H = 320
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setSize()
    window.addEventListener('resize', setSize)

    const PAD = { top: 36, right: 40, bottom: 56, left: 52 }
    const maxVal = Math.max(...data.map(d => d.cumulative))

    let progress = 0
    const duration = 2000
    const start = performance.now()

    // Mouse hit detection
    const getPoints = () => {
      const cW = W - PAD.left - PAD.right
      const cH = H - PAD.top  - PAD.bottom
      return data.map((d, i) => ({
        x: PAD.left + (i / (data.length - 1)) * cW,
        y: PAD.top  + cH - (d.cumulative / maxVal) * cH,
      }))
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx   = e.clientX - rect.left
      const pts  = getPoints()
      let closest = -1, minDist = 32
      pts.forEach((p, i) => {
        const dist = Math.abs(mx - p.x)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setActiveIdx(closest === -1 ? null : closest)
    }
    const onMouseLeave = () => setActiveIdx(null)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    function draw(prog: number) {
      const cW = W - PAD.left - PAD.right
      const cH = H - PAD.top  - PAD.bottom
      ctx.clearRect(0, 0, W, H)

      // ── Grid ──
      const ySteps = 4
      for (let i = 0; i <= ySteps; i++) {
        const y   = PAD.top + cH - (i / ySteps) * cH
        const val = Math.round((i / ySteps) * maxVal)
        ctx.beginPath()
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'
        ctx.lineWidth   = 1
        ctx.setLineDash(i === 0 ? [] : [4, 6])
        ctx.moveTo(PAD.left, y)
        ctx.lineTo(PAD.left + cW, y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle  = 'rgba(255,255,255,0.22)'
        ctx.font       = `9px 'Courier New', monospace`
        ctx.textAlign  = 'right'
        ctx.fillText(String(val), PAD.left - 10, y + 3.5)
      }

      // ── Animated points ──
      const totalSegs = data.length - 1
      const cutF      = prog * totalSegs
      const pts = getPoints()

      const visiblePts: { x: number; y: number }[] = []
      for (let i = 0; i < data.length; i++) {
        if (i <= Math.floor(cutF)) {
          visiblePts.push(pts[i])
        } else if (i === Math.floor(cutF) + 1) {
          const frac = cutF - Math.floor(cutF)
          visiblePts.push({
            x: pts[i-1].x + (pts[i].x - pts[i-1].x) * frac,
            y: pts[i-1].y + (pts[i].y - pts[i-1].y) * frac,
          })
          break
        }
      }
      if (visiblePts.length === 1 && data.length > 1) {
        const frac = cutF
        visiblePts.push({
          x: pts[0].x + (pts[1].x - pts[0].x) * frac,
          y: pts[0].y + (pts[1].y - pts[0].y) * frac,
        })
      }

      if (visiblePts.length >= 2) {
        // ── Shadow glow line ──
        ctx.beginPath()
        ctx.moveTo(visiblePts[0].x, visiblePts[0].y)
        for (let i = 1; i < visiblePts.length; i++) {
          const cp = (visiblePts[i-1].x + visiblePts[i].x) / 2
          ctx.bezierCurveTo(cp, visiblePts[i-1].y, cp, visiblePts[i].y, visiblePts[i].x, visiblePts[i].y)
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth   = 8
        ctx.shadowBlur  = 0
        ctx.stroke()

        // ── Fill gradient ──
        const fillGrad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH)
        fillGrad.addColorStop(0,   'rgba(255,255,255,0.10)')
        fillGrad.addColorStop(0.5, 'rgba(255,255,255,0.04)')
        fillGrad.addColorStop(1,   'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.moveTo(visiblePts[0].x, PAD.top + cH)
        ctx.lineTo(visiblePts[0].x, visiblePts[0].y)
        for (let i = 1; i < visiblePts.length; i++) {
          const cp = (visiblePts[i-1].x + visiblePts[i].x) / 2
          ctx.bezierCurveTo(cp, visiblePts[i-1].y, cp, visiblePts[i].y, visiblePts[i].x, visiblePts[i].y)
        }
        ctx.lineTo(visiblePts[visiblePts.length-1].x, PAD.top + cH)
        ctx.closePath()
        ctx.fillStyle = fillGrad
        ctx.fill()

        // ── Main line ──
        ctx.beginPath()
        ctx.moveTo(visiblePts[0].x, visiblePts[0].y)
        for (let i = 1; i < visiblePts.length; i++) {
          const cp = (visiblePts[i-1].x + visiblePts[i].x) / 2
          ctx.bezierCurveTo(cp, visiblePts[i-1].y, cp, visiblePts[i].y, visiblePts[i].x, visiblePts[i].y)
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'
        ctx.lineWidth   = 2
        ctx.shadowColor = 'rgba(255,255,255,0.5)'
        ctx.shadowBlur  = 10
        ctx.stroke()
        ctx.shadowBlur  = 0
      }

      // ── Monthly bar (faint, below the curve) ──
      const barW = (cW / data.length) * 0.38
      data.forEach((d, i) => {
        const frac = Math.min(Math.max(cutF - i, 0), 1)
        if (frac <= 0) return
        const bH  = (d.count / Math.max(...data.map(x => x.count))) * cH * 0.28 * frac
        const bX  = pts[i].x - barW / 2
        const bY  = PAD.top + cH - bH
        const active = activeRef.current === i
        ctx.fillStyle = active
          ? 'rgba(255,255,255,0.14)'
          : 'rgba(255,255,255,0.06)'
        ctx.fillRect(bX, bY, barW, bH)
      })

      // ── Dots ──
      const shown = Math.min(Math.floor(cutF) + 1, data.length)
      for (let i = 0; i < shown; i++) {
        const p      = pts[i]
        const active = activeRef.current === i
        if (active) {
          // Vertical guide line
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(255,255,255,0.1)'
          ctx.lineWidth   = 1
          ctx.setLineDash([3,4])
          ctx.moveTo(p.x, PAD.top)
          ctx.lineTo(p.x, PAD.top + cH)
          ctx.stroke()
          ctx.setLineDash([])

          // Tooltip box
          const tip   = `${data[i].month} '${data[i].year}  ·  +${data[i].count}  ·  Σ${data[i].cumulative}`
          ctx.font    = `bold 10px 'Courier New', monospace`
          const tw    = ctx.measureText(tip).width
          const tx    = Math.min(Math.max(p.x - tw/2 - 10, 4), W - tw - 24)
          const ty    = p.y - 42
          ctx.fillStyle = 'rgba(20,18,16,0.9)'
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.roundRect(tx, ty, tw + 20, 26, 2)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.textAlign = 'left'
          ctx.fillText(tip, tx + 10, ty + 17)

          // Large outer ring
          ctx.beginPath()
          ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.06)'
          ctx.fill()
        }

        // Dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, active ? 5 : 3.5, 0, Math.PI * 2)
        ctx.fillStyle   = active ? '#ffffff' : 'rgba(255,255,255,0.75)'
        ctx.shadowColor = 'rgba(255,255,255,0.7)'
        ctx.shadowBlur  = active ? 14 : 6
        ctx.fill()
        ctx.shadowBlur  = 0
      }

      // ── X axis labels ──
      data.forEach((d, i) => {
        const x = PAD.left + (i / (data.length - 1)) * cW
        ctx.fillStyle = activeRef.current === i
          ? 'rgba(255,255,255,0.75)'
          : 'rgba(255,255,255,0.25)'
        ctx.font      = `9px 'Courier New', monospace`
        ctx.textAlign = 'center'
        ctx.fillText(`${d.month.toUpperCase()} '${d.year}`, x, H - 16)
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth   = 1
        ctx.moveTo(x, PAD.top + cH + 2)
        ctx.lineTo(x, PAD.top + cH + 6)
        ctx.stroke()
      })
    }

    function loop(now: number) {
      const elapsed = now - start
      progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      draw(eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(loop)
      else rafRef.current = requestAnimationFrame(() => draw(1))
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', setSize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  // re-draw on hover change without restarting animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // just let the raf loop handle it (it keeps running after animation)
  }, [activeIdx])

  return (
    <section style={{
      padding: 'clamp(48px, 6vw, 80px) clamp(16px, 5vw, 64px)',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
    }}>
      {/* Diagonal lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(-55deg, transparent, transparent 80px, rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px)',
      }} />

      <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: 9,
            letterSpacing: '0.42em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', marginBottom: 10,
          }}>
            ◈ &nbsp;Deployment Activity
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: 'rgba(255,255,255,0.88)',
              margin: 0, letterSpacing: '0.04em', lineHeight: 1,
            }}>
              Tokens Over <span style={{ color: 'rgba(255,255,255,0.35)' }}>Time</span>
            </h2>
            <span style={{
              fontFamily: "'Courier New', monospace", fontSize: 10,
              letterSpacing: '0.16em', color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase', paddingBottom: 4,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              Oct 2024 — Mar 2025
            </span>
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              padding: '14px 18px',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: '2px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.02)',
              position: 'relative',
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28, color: 'rgba(255,255,255,0.88)',
                letterSpacing: '0.04em', lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 8, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
                marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '2px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.015)',
          padding: '20px 12px 4px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }} />
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', cursor: 'crosshair' }} />
        </div>

        {/* Legend */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 2, background: 'rgba(255,255,255,0.7)' }} />
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
              Cumulative deployments
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 10, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
              Monthly volume
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}