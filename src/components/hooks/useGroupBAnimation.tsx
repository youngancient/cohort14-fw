import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

// ── Types ──────────────────────────────────────────────────────
export interface AnimationRefs {
  wrapG: HTMLDivElement | null
  wrapR: HTMLDivElement | null
  wrapO: HTMLDivElement | null
  wrapU: HTMLDivElement | null
  wrapP: HTMLDivElement | null
  wrapB: HTMLDivElement | null
  barWrap: HTMLDivElement | null
  barFill: HTMLDivElement | null
  barLabel: HTMLSpanElement | null
}

export type AnimationPhase = 'intro' | 'welcome' | 'dwell' | 'outro' | 'panel'

// ── Constants ──────────────────────────────────────────────────
const BAR_DURATION = 10
const IN_GAP       = 1.0
const OUT_GAP      = 0.65

const LABELS = [
  'initialising',
  'connecting to mainnet',
  'verifying contracts',
  'syncing blockchain',
  'loading token registry',
  'ready',
]

// ── Hook ───────────────────────────────────────────────────────
export function useGroupBAnimation(
  getRefs: () => AnimationRefs,
  onPhaseChange: (phase: AnimationPhase) => void,
  onFxActiveChange: (active: boolean) => void,
  tugRef: React.MutableRefObject<{ t: number }>
) {
  const personalityTimelines = useRef<gsap.core.Timeline[]>([])
  const tugTimeline          = useRef<gsap.core.Timeline | null>(null)
  const barTween             = useRef<gsap.core.Tween | null>(null)

  // Store callbacks in refs so GSAP closures always call the latest version
  const onPhaseChangeRef    = useRef(onPhaseChange)
  const onFxActiveChangeRef = useRef(onFxActiveChange)
  onPhaseChangeRef.current    = onPhaseChange
  onFxActiveChangeRef.current = onFxActiveChange

  const phase   = (p: AnimationPhase) => { onPhaseChangeRef.current(p) }
  const fxActive = (v: boolean)        => { onFxActiveChangeRef.current(v) }

  // Always calls the getter — never stale
  const r = getRefs

  // ── Helpers ────────────────────────────────────────────────
  const killPersonalities = useCallback(() => {
    personalityTimelines.current.forEach(t => t?.kill())
    personalityTimelines.current = []
    tugTimeline.current?.kill()
    tugTimeline.current = null
  }, [])

  const resetBar = useCallback(() => {
    const { barFill, barLabel } = r()
    if (barFill)  gsap.set(barFill, { width: '0%' })
    if (barLabel) barLabel.textContent = LABELS[0]
  }, [])

  const stopBar = useCallback(() => {
    barTween.current?.kill()
    barTween.current = null
  }, [])

  // ── Bounce one letter in ───────────────────────────────────
  const bounceOneLetter = useCallback(
    (el: HTMLElement, offRight: number, onComplete: () => void) => {
      const tl = gsap.timeline({ onComplete })
      const H1 = -280, H2 = -145, H3 = -55

      tl.fromTo(el, { x: offRight }, { x: 0, duration: 3.2, ease: 'power1.inOut' }, 0)
      tl.set(el, { y: 0 }, 0)
        .to(el, { y: H1, duration: 0.58, ease: 'power2.out'  }, 0.00)
        .to(el, { y: H1, duration: 0.36, ease: 'none'         }, 0.58)
        .to(el, { y: 0,  duration: 0.44, ease: 'power3.in'   }, 0.94)
        .to(el, { y: 10, duration: 0.18, ease: 'none'         }, 1.38)
        .to(el, { y: H2, duration: 0.46, ease: 'power2.out'  }, 1.56)
        .to(el, { y: H2, duration: 0.24, ease: 'none'         }, 2.02)
        .to(el, { y: 0,  duration: 0.36, ease: 'power3.in'   }, 2.26)
        .to(el, { y: 6,  duration: 0.14, ease: 'none'         }, 2.62)
        .to(el, { y: H3, duration: 0.34, ease: 'power2.out'  }, 2.76)
        .to(el, { y: 0,  duration: 0.30, ease: 'power2.in'   }, 3.10)
        .to(el, { y: -14,duration: 0.18, ease: 'power2.out'  }, 3.40)
        .to(el, { y: 0,  duration: 0.20, ease: 'power2.in'   }, 3.58)

      tl.set(el, { scaleX: 1, scaleY: 1 }, 0)
        .to(el, { scaleX: 0.66, scaleY: 1.50, duration: 0.52, ease: 'power1.out'  }, 0.06)
        .to(el, { scaleX: 0.74, scaleY: 1.30, duration: 0.36, ease: 'none'        }, 0.58)
        .to(el, { scaleX: 1.76, scaleY: 0.38, duration: 0.26, ease: 'power4.in'   }, 1.06)
        .to(el, { scaleX: 1.76, scaleY: 0.38, duration: 0.22, ease: 'none'        }, 1.32)
        .to(el, { scaleX: 0.76, scaleY: 1.32, duration: 0.24, ease: 'power2.out'  }, 1.54)
        .to(el, { scaleX: 0.78, scaleY: 1.26, duration: 0.42, ease: 'power1.out'  }, 1.58)
        .to(el, { scaleX: 0.82, scaleY: 1.18, duration: 0.24, ease: 'none'        }, 2.02)
        .to(el, { scaleX: 1.52, scaleY: 0.56, duration: 0.22, ease: 'power3.in'   }, 2.44)
        .to(el, { scaleX: 1.52, scaleY: 0.56, duration: 0.14, ease: 'none'        }, 2.66)
        .to(el, { scaleX: 0.88, scaleY: 1.14, duration: 0.22, ease: 'power2.out'  }, 2.80)
        .to(el, { scaleX: 0.90, scaleY: 1.12, duration: 0.30, ease: 'power1.out'  }, 2.78)
        .to(el, { scaleX: 1.28, scaleY: 0.76, duration: 0.16, ease: 'power3.in'   }, 3.12)
        .to(el, { scaleX: 1,    scaleY: 1,    duration: 0.90, ease: 'elastic.out(0.9,0.36)' }, 3.30)

      return tl
    }, []
  )

  // ── Bounce out one letter ──────────────────────────────────
  const bounceOutOne = useCallback(
    (el: HTMLElement, offLeft: number, onComplete: () => void) => {
      const tl = gsap.timeline({ onComplete })
      tl.to(el, { scaleX: 1.60, scaleY: 0.48, y: 18,   duration: 0.42, ease: 'power2.in'   }, 0)
        .to(el, { scaleX: 1.60, scaleY: 0.48, y: 18,   duration: 0.30, ease: 'none'         }, 0.42)
        .to(el, { scaleX: 0.64, scaleY: 1.52, y: -165, duration: 0.52, ease: 'power3.out'   }, 0.72)
        .to(el, { x: offLeft * 0.18,                    duration: 1.10, ease: 'power1.inOut' }, 0.72)
        .to(el, { scaleX: 0.70, scaleY: 1.34, y: -170, duration: 0.28, ease: 'none'         }, 1.24)
        .to(el, { scaleX: 1.56, scaleY: 0.52, y: 14,   duration: 0.40, ease: 'power3.in'    }, 1.52)
        .to(el, { scaleX: 1.56, scaleY: 0.52, y: 14,   duration: 0.18, ease: 'none'         }, 1.92)
        .to(el, { scaleX: 0.74, scaleY: 1.34, y: -90,  duration: 0.42, ease: 'power2.out'   }, 2.10)
        .to(el, { x: offLeft * 0.55,                    duration: 0.80, ease: 'power1.in'    }, 2.10)
        .to(el, { x: offLeft, y: 0, scaleX: 1.36, scaleY: 0.70, opacity: 0,
                  duration: 0.55, ease: 'power3.in' }, 2.28)
      return tl
    }, []
  )

  // ── Drag P and B in ────────────────────────────────────────
  const dragPandB = useCallback(
    (onDone: () => void) => {
      const { wrapP, wrapB } = r()
      if (!wrapP || !wrapB) return
      const offRight = window.innerWidth * 0.90

      gsap.set(wrapP, { x: offRight,                   y: 0, scaleX: 1, scaleY: 1, rotation: 0,   opacity: 1 })
      gsap.set(wrapB, { x: offRight + offRight * 0.40, y: 0, scaleX: 1, scaleY: 1, rotation: -16, opacity: 1 })
      tugRef.current.t = 0.75

      gsap.to(wrapP, {
        x: 0, duration: 5.0, ease: 'power1.inOut',
        onUpdate() {
          const px   = gsap.getProperty(wrapP, 'x') as number
          const prog = Math.max(0, 1 - Math.abs(px) / offRight)
          gsap.set(wrapP, { rotation: Math.sin(prog * Math.PI) * 16 })
        },
        onComplete() {
          gsap.timeline()
            .to(wrapP, { scaleX: 1.16, scaleY: 0.78, y: 14, duration: 0.38, ease: 'power3.in' })
            .to(wrapP, { scaleX: 1, scaleY: 1, y: 0, rotation: 0, duration: 1.1, ease: 'elastic.out(1,0.38)' })
        },
      })

      gsap.to(wrapB, {
        x: 32, duration: 5.8, ease: 'power1.in', delay: 0.90,
        onUpdate() {
          const bx   = gsap.getProperty(wrapB, 'x') as number
          const maxD = offRight * 1.40
          const dist = Math.max(0, Math.abs(bx) - 32)
          gsap.set(wrapB, {
            rotation: -18 * Math.min(dist / maxD, 1),
            scaleX:   1 + 0.24 * Math.min(dist / maxD, 1),
            scaleY:   1 / (1 + 0.24 * Math.min(dist / maxD, 1)),
          })
        },
        onComplete() {
          gsap.timeline({
            onComplete() {
              gsap.to(tugRef.current, {
                t: 0, duration: 2.2, ease: 'elastic.out(1,0.40)',
                onComplete: () => { onDone() },
              })
            },
          })
            .to(wrapB, { x: -28, scaleX: 0.84, scaleY: 1.20, rotation: 10,  duration: 0.65, ease: 'power2.out'   })
            .to(wrapB, { x: 12,  scaleX: 1.10, scaleY: 0.92, rotation: -5,  duration: 0.50, ease: 'power2.inOut' })
            .to(wrapB, { x: 0,   scaleX: 1,    scaleY: 1,    rotation: 0,   duration: 1.1,  ease: 'elastic.out(1,0.40)' })
        },
      })
    },
    [tugRef]
  )

  // ── Bounce in ──────────────────────────────────────────────
  const bounceIn = useCallback(
    (onDone: () => void) => {
      const { wrapG, wrapR, wrapO, wrapU, wrapP, wrapB } = r()
      const allWraps = [wrapG, wrapR, wrapO, wrapU, wrapP, wrapB]
      const normal   = [wrapG, wrapR, wrapO, wrapU]
      const offRight = window.innerWidth * 0.80

      allWraps.forEach(el => {
        if (el) gsap.set(el, { x: offRight, y: 0, scaleX: 1, scaleY: 1, rotation: 0, opacity: 1 })
      })

      let normalDone = 0
      const normalCount = normal.filter(Boolean).length
      normal.forEach((el, i) => {
        if (!el) return
        gsap.delayedCall(i * IN_GAP, () => {
          bounceOneLetter(el, offRight, () => {
            normalDone++
            if (normalDone === normalCount)
              gsap.delayedCall(1.2, () => { dragPandB(onDone) })
          })
        })
      })
    },
    [bounceOneLetter, dragPandB]
  )

  // ── Bounce out ─────────────────────────────────────────────
  const bounceOut = useCallback(
    (onDone: () => void) => {
      const { wrapG, wrapR, wrapO, wrapU, wrapP, wrapB } = r()
      const allWraps = [wrapG, wrapR, wrapO, wrapU, wrapP, wrapB]

      killPersonalities()
      if (wrapB) gsap.set(wrapB, { x: 0, rotation: 0, scaleX: 1, scaleY: 1, y: 0 })
      if (wrapP) gsap.set(wrapP, { x: 0, rotation: 0, scaleX: 1, scaleY: 1, y: 0 })
      tugRef.current.t = 0

      const offLeft = -(window.innerWidth * 0.88)
      let completed = 0
      const total   = allWraps.filter(Boolean).length

      allWraps.forEach((el, i) => {
        if (!el) return
        gsap.delayedCall(i * OUT_GAP, () => {
          bounceOutOne(el, offLeft, () => {
            completed++
            if (completed === total) {
              fxActive(false)
              onDone()
            }
          })
        })
      })
    },
    [killPersonalities, bounceOutOne, tugRef]
  )

  // ── Bar ────────────────────────────────────────────────────
  const runBar = useCallback(
    (onFull: () => void) => {
      const { barFill, barLabel } = r()
      if (!barFill || !barLabel) return

      barTween.current = gsap.to(barFill, {
        width: '100%',
        duration: BAR_DURATION,
        ease: 'none',
        onUpdate() {
          const pct = parseFloat(barFill.style.width) / 100
          const idx = Math.min(Math.floor(pct * LABELS.length), LABELS.length - 1)
          barLabel.textContent = LABELS[idx]
        },
        onComplete() {
          barLabel.textContent = LABELS[LABELS.length - 1]
          onFull()
        },
      })
    }, []
  )

  // ── Personalities ──────────────────────────────────────────
  const startPersonalities = useCallback(() => {
    killPersonalities()
    const { wrapG, wrapR, wrapO, wrapU, wrapP, wrapB } = r()
    if (!wrapG || !wrapR || !wrapO || !wrapU || !wrapP || !wrapB) return

    const gNod = (): void => {
      const tl = gsap.timeline({ onComplete: () => { gsap.delayedCall(6.0 + Math.random() * 4, gNod) } })
      tl.to(wrapG, { scaleY: 0.80, scaleX: 1.14, y: 20,  duration: 0.40, ease: 'power2.in'  })
        .to(wrapG, { scaleY: 0.80, scaleX: 1.14, y: 20,  duration: 0.22, ease: 'none'        })
        .to(wrapG, { scaleY: 1.22, scaleX: 0.86, y: -18, duration: 0.48, ease: 'power2.out'  })
        .to(wrapG, { scaleY: 1,    scaleX: 1,    y: 0,   duration: 1.20, ease: 'elastic.out(1,0.42)' })
      personalityTimelines.current.push(tl)
    }
    gsap.delayedCall(1.2, gNod)

    const rJump = (): void => {
      const tl = gsap.timeline({ onComplete: () => { gsap.delayedCall(6.5 + Math.random() * 4, rJump) } })
      tl.to(wrapR, { scaleY: 0.66, scaleX: 1.28, y: 22,   duration: 0.36, ease: 'power2.in'  })
        .to(wrapR, { scaleY: 0.66, scaleX: 1.28, y: 22,   duration: 0.22, ease: 'none'        })
        .to(wrapR, { scaleY: 1.40, scaleX: 0.72, y: -130, duration: 0.46, ease: 'power3.out'  })
        .to(wrapR, { scaleY: 1.22, scaleX: 0.84, y: -140, duration: 0.28, ease: 'power1.out'  })
        .to(wrapR, { scaleY: 0.54, scaleX: 1.32, y: 18,   duration: 0.38, ease: 'power4.in'   })
        .to(wrapR, { scaleY: 0.54, scaleX: 1.32, y: 18,   duration: 0.18, ease: 'none'        })
        .to(wrapR, { scaleY: 1.24, scaleX: 0.83, y: -52,  duration: 0.36, ease: 'power2.out'  })
        .to(wrapR, { scaleY: 0.80, scaleX: 1.16, y: 10,   duration: 0.30, ease: 'power2.in'   })
        .to(wrapR, { scaleY: 1.10, scaleX: 0.92, y: -20,  duration: 0.28, ease: 'power2.out'  })
        .to(wrapR, { scaleY: 0.92, scaleX: 1.08, y: 4,    duration: 0.24, ease: 'power2.in'   })
        .to(wrapR, { scaleY: 1,    scaleX: 1,    y: 0,    duration: 0.85, ease: 'elastic.out(1,0.42)' })
      personalityTimelines.current.push(tl)
    }
    gsap.delayedCall(1.8, rJump)

    const oTl = gsap.timeline({ repeat: -1, yoyo: true })
    oTl.to(wrapO, { y: -22, duration: 3.8, ease: 'sine.inOut' })
    personalityTimelines.current.push(oTl)

    const uTl = gsap.timeline({ repeat: -1, yoyo: true })
    uTl.to(wrapU, { scaleX: 1.09, scaleY: 0.94, duration: 3.2, ease: 'sine.inOut' })
    personalityTimelines.current.push(uTl)

    const applyTug = (): void => {
      const t = tugRef.current.t
      gsap.set(wrapB, { x: t * 62, rotation: t * 15, scaleX: 1 + t * 0.18, scaleY: 1 - Math.abs(t) * 0.12 })
      gsap.set(wrapP, { x: t * 18, rotation: t * 18, scaleX: 1 + Math.abs(t) * 0.07, scaleY: Math.max(0.70, 1 - t * 0.15) })
    }

    const runTug = (): void => {
      tugTimeline.current = gsap.timeline({
        onComplete: () => { gsap.delayedCall(4.5 + Math.random() * 3, runTug) },
      })
        .to(tugRef.current, { t: 1,     duration: 2.8,  ease: 'power1.in',           onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: 1.35,  duration: 0.70, ease: 'power3.in',           onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: -0.95, duration: 0.22, ease: 'power4.out',          onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: 0.62,  duration: 0.55, ease: 'power2.out',          onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: -0.44, duration: 0.48, ease: 'power2.inOut',        onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: 0.30,  duration: 0.42, ease: 'power2.out',          onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: -0.20, duration: 0.36, ease: 'power2.inOut',        onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: 0.12,  duration: 0.30, ease: 'power2.out',          onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: -0.06, duration: 0.26, ease: 'power2.inOut',        onUpdate: () => { applyTug() } })
        .to(tugRef.current, { t: 0,     duration: 1.8,  ease: 'elastic.out(1,0.45)', onUpdate: () => { applyTug() } })
    }
    gsap.delayedCall(2.5, runTug)
  }, [killPersonalities, tugRef])

  // ── Main loop ──────────────────────────────────────────────
  const runLoop = useCallback(() => {
    const { barWrap } = r()
    if (!barWrap) return

    fxActive(true)
    phase('intro')
    resetBar()
    gsap.set(barWrap, { opacity: 0 })

    bounceIn(() => {
      // ── All letters have landed — fire welcome FIRST ──
      phase('welcome')

      // Wait 1.5s (welcome animation plays), then show bar
      gsap.delayedCall(1.5, () => {
        const { barWrap: bw } = r()
        if (!bw) return
        gsap.to(bw, {
          opacity: 1, duration: 0.5, ease: 'power2.out',
          onComplete() {
            startPersonalities()
            runBar(() => {
              gsap.to(bw, {
                opacity: 0, duration: 0.4, ease: 'power2.in',
                onComplete() {
                  stopBar()
                  phase('outro')
                  bounceOut(() => {
                    phase('panel')
                  })
                },
              })
            })
          },
        })
      })
    })
  }, [resetBar, stopBar, bounceIn, startPersonalities, runBar, bounceOut])

  // ── Turbulence animation ───────────────────────────────────
  useEffect(() => {
    const turb = document.getElementById('ft-turb')
    if (!turb) return
    let turbPhase = 0
    let raf: number
    const tick = () => {
      turbPhase += 0.0008
      const bfx = (0.016 + Math.sin(turbPhase) * 0.004).toFixed(4)
      const bfy = (0.020 + Math.cos(turbPhase * 1.3) * 0.004).toFixed(4)
      turb.setAttribute('baseFrequency', `${bfx} ${bfy}`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return { runLoop }
}