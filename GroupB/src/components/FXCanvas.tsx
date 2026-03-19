import { useEffect, useRef } from 'react'

interface Point { x: number; y: number }

function fabrik(
  joints: Point[],
  boneLens: number[],
  target: Point,
  poleHint?: Point,
  iterations = 5
): Point[] {
  const n   = joints.length
  const pts = joints.map(j => ({ x: j.x, y: j.y }))
  const root = { x: pts[0].x, y: pts[0].y }
  const totalLen = boneLens.reduce((a, b) => a + b, 0)
  const dx = target.x - root.x, dy = target.y - root.y
  const dist = Math.sqrt(dx * dx + dy * dy) || 0.001

  if (dist >= totalLen) {
    for (let i = 1; i < n; i++) {
      const d = Math.sqrt((target.x - pts[i-1].x) ** 2 + (target.y - pts[i-1].y) ** 2) || 0.001
      const r = boneLens[i-1] / d
      pts[i].x = (1-r) * pts[i-1].x + r * target.x
      pts[i].y = (1-r) * pts[i-1].y + r * target.y
    }
    return pts
  }

  for (let iter = 0; iter < iterations; iter++) {
    pts[n-1].x = target.x; pts[n-1].y = target.y
    for (let i = n-2; i >= 0; i--) {
      const d = Math.sqrt((pts[i+1].x - pts[i].x) ** 2 + (pts[i+1].y - pts[i].y) ** 2) || 0.001
      const r = boneLens[i] / d
      pts[i].x = (1-r) * pts[i+1].x + r * pts[i].x
      pts[i].y = (1-r) * pts[i+1].y + r * pts[i].y
    }
    pts[0].x = root.x; pts[0].y = root.y
    for (let i = 0; i < n-1; i++) {
      const d = Math.sqrt((pts[i+1].x - pts[i].x) ** 2 + (pts[i+1].y - pts[i].y) ** 2) || 0.001
      const r = boneLens[i] / d
      pts[i+1].x = (1-r) * pts[i].x + r * pts[i+1].x
      pts[i+1].y = (1-r) * pts[i].y + r * pts[i+1].y
    }
  }

  if (n === 3 && poleHint) {
    const ax = pts[2].x - pts[0].x, ay = pts[2].y - pts[0].y
    const bx = pts[1].x - pts[0].x, by = pts[1].y - pts[0].y
    const t = Math.max(0, Math.min(1, (ax*bx + ay*by) / (ax*ax + ay*ay || 1)))
    const clx = pts[0].x + ax*t, cly = pts[0].y + ay*t
    const px = poleHint.x - clx, py = poleHint.y - cly
    const pm = Math.sqrt(px*px + py*py) || 1
    const ex = pts[1].x - clx, ey = pts[1].y - cly
    const em = Math.sqrt(ex*ex + ey*ey) || 0.001
    const nx = clx + (px/pm)*em*0.7 + (ex/em)*em*0.3
    const ny = cly + (py/pm)*em*0.7 + (ey/em)*em*0.3
    const d0 = Math.sqrt((nx - pts[0].x) ** 2 + (ny - pts[0].y) ** 2) || 0.001
    pts[1].x = pts[0].x + (nx - pts[0].x) / d0 * boneLens[0]
    pts[1].y = pts[0].y + (ny - pts[0].y) / d0 * boneLens[0]
    const d1 = Math.sqrt((pts[2].x - pts[1].x) ** 2 + (pts[2].y - pts[1].y) ** 2) || 0.001
    pts[2].x = pts[1].x + (pts[2].x - pts[1].x) / d1 * boneLens[1]
    pts[2].y = pts[1].y + (pts[2].y - pts[1].y) / d1 * boneLens[1]
  }
  return pts
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
function limbColor(t: number): string {
  const strain = Math.max(0, t)
  const snap   = Math.max(0, -t)
  const r = Math.round(26  + strain * 35  - snap * 10)
  const g = Math.round(107 + strain * 120 - snap * 40)
  const b = Math.round(224 + strain * 31  - snap * 60)
  return `rgb(${r},${g},${b})`
}
interface FXCanvasProps {
  active: boolean
  tugRef: React.MutableRefObject<{ t: number }>
  wrapPRef: React.RefObject<HTMLDivElement>
  wrapBRef: React.RefObject<HTMLDivElement>
}

export default function FXCanvas({ active, tugRef, wrapPRef, wrapBRef }: FXCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const smoothRef = useRef({
    pRightTarget: { x: 0, y: 0 },
    pLeftTarget:  { x: 0, y: 0 },
    bLeftTarget:  { x: 0, y: 0 },
    bRightTarget: { x: 0, y: 0 },
  })
  const lastFistRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // draw loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const drawChain = (pts: Point[], thick: number, color: string) => {
      if (!pts || pts.length < 2) return
      ctx.save()
      ctx.strokeStyle = color; ctx.lineWidth = thick + 6
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.filter = 'blur(6px)'; ctx.globalAlpha = 0.22
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y)
      pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke(); ctx.restore()

      ctx.save()
      ctx.strokeStyle = color; ctx.lineWidth = thick
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y)
      pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke(); ctx.restore()
    }

    const dot = (x: number, y: number, r: number, color: string) => {
      ctx.save(); ctx.fillStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }

    const draw = () => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!active) return

      const pEl = wrapPRef.current
      const bEl = wrapBRef.current
      if (!pEl || !bEl) return

      const pR = pEl.getBoundingClientRect()
      const bR = bEl.getBoundingClientRect()
      const t   = tugRef.current.t
      const col = limbColor(t)
      const sm  = smoothRef.current

      const pH     = pR.height
      const limbSeg = pH * 0.18
      const limbW   = Math.max(3, pH * 0.032)

      // P LEGS
      const pHipLx = pR.left + pR.width  * (41/386)
      const pHipRx = pR.left + pR.width  * (151/386)
      const pHipY  = pR.bottom
      const pFloor = pHipY + limbSeg * 1.6
      const pStride = t * 0.7 + 0.25

      const pLfX = pHipLx - pStride * limbSeg * 0.7
      const pLfY = pFloor  - Math.abs(pStride) * limbSeg * 0.25
      const pRfX = pHipRx + pStride * limbSeg * 0.8
      const pRfY = pFloor  - Math.abs(pStride) * limbSeg * 0.15

      sm.pLeftTarget.x  = lerp(sm.pLeftTarget.x,  pLfX, 0.06)
      sm.pLeftTarget.y  = lerp(sm.pLeftTarget.y,  pLfY, 0.06)
      sm.pRightTarget.x = lerp(sm.pRightTarget.x, pRfX, 0.06)
      sm.pRightTarget.y = lerp(sm.pRightTarget.y, pRfY, 0.06)

      const pLegBones = [limbSeg, limbSeg]
      const pLLeg = fabrik(
        [{ x: pHipLx, y: pHipY }, { x: pHipLx, y: pHipY + limbSeg * 0.8 }, { ...sm.pLeftTarget }],
        pLegBones, sm.pLeftTarget, { x: pHipLx - pStride * limbSeg * 0.3, y: pHipY + limbSeg * 0.5 }
      )
      const pRLeg = fabrik(
        [{ x: pHipRx, y: pHipY }, { x: pHipRx, y: pHipY + limbSeg * 0.8 }, { ...sm.pRightTarget }],
        pLegBones, sm.pRightTarget, { x: pHipRx + pStride * limbSeg * 0.3, y: pHipY + limbSeg * 0.5 }
      )

      drawChain(pLLeg, limbW, col); drawChain(pRLeg, limbW, col)
      dot(pLLeg[1].x, pLLeg[1].y, limbW * 0.65, col)
      dot(pRLeg[1].x, pRLeg[1].y, limbW * 0.65, col)
      ;[pLLeg, pRLeg].forEach((leg, li) => {
        const fl = limbW * 2.6; const dir = li === 0 ? -1 : 1
        ctx.save()
        ctx.strokeStyle = col; ctx.lineWidth = limbW * 1.1; ctx.lineCap = 'round'
        ctx.shadowColor = col; ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.moveTo(leg[2].x - fl * 0.3, leg[2].y)
        ctx.lineTo(leg[2].x + fl * dir, leg[2].y)
        ctx.stroke(); ctx.restore()
      })

      // P ARM
      const pArmShX = pR.left + pR.width  * (151/386)
      const pArmShY = pR.top  + pR.height * (208/700)
      const pArmTgtX = pR.right + pH * 0.08 + t * pH * 0.28
      const pArmTgtY = pArmShY  + t * pH * 0.06

      sm.pRightTarget.x = lerp(sm.pRightTarget.x, pArmTgtX, 0.07)
      sm.pRightTarget.y = lerp(sm.pRightTarget.y, pArmTgtY, 0.07)

      const armBones = [limbSeg * 0.9, limbSeg * 0.9]
      const pArm = fabrik(
        [{ x: pArmShX, y: pArmShY }, { x: pArmShX + limbSeg * 0.5, y: pArmShY + limbSeg * 0.4 }, { ...sm.pRightTarget }],
        armBones, sm.pRightTarget, { x: pArmShX + limbSeg * 0.6, y: pArmShY + limbSeg * 0.8 }
      )
      drawChain(pArm, limbW, col)
      dot(pArm[1].x, pArm[1].y, limbW * 0.65, col)
      dot(pArm[2].x, pArm[2].y, limbW * 0.9,  col)
      lastFistRef.current = { x: pArm[2].x, y: pArm[2].y }

      // B ARMS
      const bShLx = bR.left + bR.width * 0.22
      const bShRx = bR.left + bR.width * 0.72
      const bShY  = bR.top  + bR.height * 0.45
      const escapeX = t * bR.height * 0.28

      const bLTgtX = bR.left - bR.height * 0.22 - escapeX
      const bLTgtY = bShY - bR.height * 0.04 - t * bR.height * 0.06
      const bRTgtX = bR.left - bR.height * 0.05 - escapeX * 0.6
      const bRTgtY = bShY + bR.height * 0.08

      sm.bLeftTarget.x  = lerp(sm.bLeftTarget.x,  bLTgtX, 0.07)
      sm.bLeftTarget.y  = lerp(sm.bLeftTarget.y,  bLTgtY, 0.07)
      sm.bRightTarget.x = lerp(sm.bRightTarget.x, bRTgtX, 0.07)
      sm.bRightTarget.y = lerp(sm.bRightTarget.y, bRTgtY, 0.07)

      const bArmBones = [limbSeg * 0.85, limbSeg * 0.85]
      const bLArm = fabrik(
        [{ x: bShLx, y: bShY }, { x: bShLx - limbSeg * 0.4, y: bShY + limbSeg * 0.35 }, { ...sm.bLeftTarget }],
        bArmBones, sm.bLeftTarget, { x: bShLx - limbSeg * 0.5, y: bShY + limbSeg * 0.8 }
      )
      const bRArm = fabrik(
        [{ x: bShRx, y: bShY }, { x: bShRx - limbSeg * 0.35, y: bShY + limbSeg * 0.4 }, { ...sm.bRightTarget }],
        bArmBones, sm.bRightTarget, { x: bShRx - limbSeg * 0.4, y: bShY + limbSeg * 0.8 }
      )
      drawChain(bLArm, limbW * 0.9, col); drawChain(bRArm, limbW * 0.9, col)
      dot(bLArm[1].x, bLArm[1].y, limbW * 0.6,  col)
      dot(bLArm[2].x, bLArm[2].y, limbW * 0.85, col)
      dot(bRArm[1].x, bRArm[1].y, limbW * 0.6,  col)
      dot(bRArm[2].x, bRArm[2].y, limbW * 0.85, col)

      // ROPE
      const rSX = lastFistRef.current.x, rSY = lastFistRef.current.y
      const rEX = bR.left + bR.width  * 0.08
      const rEY = bR.top  + bR.height * 0.48
      const tension = Math.max(0, t)
      const slack   = (1 - Math.min(tension, 1)) * 44 + 6
      const midX    = (rSX + rEX) / 2
      const midY    = (rSY + rEY) / 2 + slack
      const rc2 = Math.round(26 + tension * 40)
      const gc2 = Math.round(107 + tension * 100)
      const ropeCol = `rgb(${rc2},${gc2},224)`

      ctx.save(); ctx.globalAlpha = 0.42; ctx.strokeStyle = ropeCol
      ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.filter = 'blur(8px)'
      ctx.beginPath(); ctx.moveTo(rSX, rSY); ctx.quadraticCurveTo(midX, midY, rEX, rEY)
      ctx.stroke(); ctx.restore()

      ctx.save(); ctx.globalAlpha = 1; ctx.strokeStyle = ropeCol
      ctx.lineWidth = 3.5; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(rSX, rSY); ctx.quadraticCurveTo(midX, midY, rEX, rEY)
      ctx.stroke(); ctx.restore()

      ctx.save(); ctx.globalAlpha = 0.55; ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 1.2; ctx.lineCap = 'round'
      ctx.setLineDash([5, 10]); ctx.lineDashOffset = -(performance.now() * 0.055 % 15)
      ctx.beginPath(); ctx.moveTo(rSX, rSY); ctx.quadraticCurveTo(midX, midY, rEX, rEY)
      ctx.stroke(); ctx.restore()

      dot(rSX, rSY, 5, ropeCol)
      dot(rEX, rEY, 5, ropeCol)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [active, tugRef, wrapPRef, wrapBRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[12] pointer-events-none"
    />
  )
}