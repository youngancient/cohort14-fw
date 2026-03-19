'use client'
import { useEffect, useRef, useCallback } from 'react'
import FXCanvas from './FXCanvas'
import { useGroupBAnimation } from './hooks/useGroupBAnimation'
import type { AnimationRefs, AnimationPhase } from './hooks/useGroupBAnimation'
import gsap from 'gsap'

const P_PATH  = 'M41 700H203Q285 700 326.0 656.0Q367 612 367 527V458Q367 373 326.0 329.0Q285 285 203 285H151V0H41ZM203 385Q230 385 243.5 400.0Q257 415 257 451V534Q257 570 243.5 585.0Q230 600 203 600H151V385Z'
const P_ADV   = 386
const FONT_CAP = 700

interface SplashPageProps {
  onComplete: () => void
}

export default function SplashPage({ onComplete }: SplashPageProps) {

  const wrapGRef    = useRef<HTMLDivElement>(null)
  const wrapRRef    = useRef<HTMLDivElement>(null)
  const wrapORef    = useRef<HTMLDivElement>(null)
  const wrapURef    = useRef<HTMLDivElement>(null)
  const wrapPRef    = useRef<HTMLDivElement>(null)
  const wrapBRef    = useRef<HTMLDivElement>(null)
  const barWrapRef  = useRef<HTMLDivElement>(null)
  const barFillRef  = useRef<HTMLDivElement>(null)
  const barLabelRef = useRef<HTMLSpanElement>(null)
  const welcomeRef  = useRef<HTMLDivElement>(null)

  const svgGRef = useRef<SVGSVGElement>(null)
  const svgRRef = useRef<SVGSVGElement>(null)
  const svgORef = useRef<SVGSVGElement>(null)
  const svgURef = useRef<SVGSVGElement>(null)
  const svgBRef = useRef<SVGSVGElement>(null)
  const txtGRef = useRef<SVGTextElement>(null)
  const txtRRef = useRef<SVGTextElement>(null)
  const txtORef = useRef<SVGTextElement>(null)
  const txtURef = useRef<SVGTextElement>(null)
  const txtBRef = useRef<SVGTextElement>(null)
  const svgPRef = useRef<SVGSVGElement>(null)
  const tugRef  = useRef({ t: 0 })

  // Keep onComplete in a ref so GSAP callbacks never get stale
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const applyFontSize = useCallback(() => {
    const FS    = Math.min(Math.floor(window.innerWidth * 0.13), 160)
    const SCALE = FS / FONT_CAP
    ;[
      { txt: txtGRef.current, svg: svgGRef.current },
      { txt: txtRRef.current, svg: svgRRef.current },
      { txt: txtORef.current, svg: svgORef.current },
      { txt: txtURef.current, svg: svgURef.current },
      { txt: txtBRef.current, svg: svgBRef.current },
    ].forEach(({ txt, svg }) => {
      if (!txt || !svg) return
      txt.setAttribute('font-size', FS + 'px')
      txt.setAttribute('x', '0')
      txt.setAttribute('y', FS + 'px')
      const bb = txt.getBBox?.() ?? { width: FS * 0.65, height: FS, x: 0, y: 0 }
      txt.setAttribute('x', (-bb.x) + 'px')
      svg.setAttribute('width',   (bb.width  + 4) + 'px')
      svg.setAttribute('height',  (bb.height + 4) + 'px')
      svg.setAttribute('viewBox', `${bb.x-2} ${bb.y-2} ${bb.width+4} ${bb.height+4}`)
    })
    if (svgPRef.current) {
      svgPRef.current.setAttribute('width',   P_ADV   * SCALE + 'px')
      svgPRef.current.setAttribute('height',  FONT_CAP * SCALE + 'px')
      svgPRef.current.setAttribute('viewBox', `0 0 ${P_ADV} ${FONT_CAP}`)
    }
  }, [])

  // dropWelcome is stable — reads refs at call time
  const dropWelcome = useCallback(() => {
    const wel = welcomeRef.current
    const bEl = wrapBRef.current
    if (!wel || !bEl) return

    // Place at origin invisibly so browser computes its size
    gsap.set(wel, { position: 'fixed', top: 0, left: 0, opacity: 0, scaleX: 1, scaleY: 1 })

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const welRect = wel.getBoundingClientRect()
      const welW    = welRect.width  > 0 ? welRect.width  : 120
      const welH    = welRect.height > 0 ? welRect.height : 38

      const bRect    = bEl.getBoundingClientRect()
      const bCentreX = bRect.left + bRect.width  / 2
      const bTopY    = bRect.top

      const landX = bCentreX - welW / 2
      const landY = bTopY - welH - 2

      gsap.set(wel, { left: landX, top: -welH - 60, opacity: 1, scaleX: 1, scaleY: 1 })

      gsap.timeline()
        .to(wel, { top: landY - welH * 0.28, scaleX: 0.78, scaleY: 1.55, duration: 0.46, ease: 'power2.in' })
        .to(wel, { top: landY + 7,           scaleX: 1.92, scaleY: 0.25, duration: 0.09, ease: 'power4.in' })
        .to(wel, {                            scaleX: 1.92, scaleY: 0.25, duration: 0.07, ease: 'none' })
        .to(wel, { top: landY - welH * 0.50, scaleX: 0.72, scaleY: 1.46, duration: 0.24, ease: 'power2.out' })
        .to(wel, { top: landY + 4,           scaleX: 1.50, scaleY: 0.52, duration: 0.15, ease: 'power2.in' })
        .to(wel, { top: landY - welH * 0.16, scaleX: 0.88, scaleY: 1.20, duration: 0.16, ease: 'power2.out' })
        .to(wel, { top: landY,               scaleX: 1.14, scaleY: 0.86, duration: 0.11, ease: 'power2.in' })
        .to(wel, {                            scaleX: 1,    scaleY: 1,    duration: 0.72, ease: 'elastic.out(1,0.40)' })
        .to(wel, {                            scaleX: 1.04, scaleY: 0.96, duration: 0.20, ease: 'sine.inOut' })
        .to(wel, {                            scaleX: 1,    scaleY: 1,    duration: 0.24, ease: 'elastic.out(1,0.5)' })
    }))
  }, [])

  const handlePhaseRef = useRef<(p: AnimationPhase) => void>(() => {})
  handlePhaseRef.current = (phase: AnimationPhase) => {
    if (phase === 'welcome') dropWelcome()
    if (phase === 'panel') {
      const wel = welcomeRef.current
      if (wel) {
        gsap.to(wel, { opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: () => { onCompleteRef.current() } })
      } else {
        onCompleteRef.current()
      }
    }
  }

  const handlePhase = useCallback((phase: AnimationPhase) => {
    handlePhaseRef.current(phase)
  }, [])

  const setFxActive = useCallback(() => {}, [])

  const getAnimRefs = useCallback((): AnimationRefs => ({
    wrapG:    wrapGRef.current,
    wrapR:    wrapRRef.current,
    wrapO:    wrapORef.current,
    wrapU:    wrapURef.current,
    wrapP:    wrapPRef.current,
    wrapB:    wrapBRef.current,
    barWrap:  barWrapRef.current,
    barFill:  barFillRef.current,
    barLabel: barLabelRef.current,
  }), [])

  const { runLoop } = useGroupBAnimation(getAnimRefs, handlePhase, setFxActive, tugRef)

  useEffect(() => {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        applyFontSize()
        runLoop()
      }))
    })
    window.addEventListener('resize', applyFontSize)
    return () => window.removeEventListener('resize', applyFontSize)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ticks = Array.from({ length: 19 }, (_, i) => i + 1)

  return (
    <div className="w-full h-full overflow-hidden bg-white">

      {/* Fonts — self-contained so SplashPage works independently */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap"
      />

      <svg style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="f-wobble" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence id="ft-turb" type="fractalNoise" baseFrequency="0.018 0.022"
              numOctaves={3} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={3}
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <FXCanvas
        active={true}
        tugRef={tugRef}
        wrapPRef={wrapPRef as React.RefObject<HTMLDivElement>}
        wrapBRef={wrapBRef as React.RefObject<HTMLDivElement>}
      />

      <div className="fixed top-1/2 left-1/2 flex flex-col items-center justify-center z-10 pointer-events-none"
           style={{ transform: 'translate(-50%, -50%)' }}>

        <div className="flex items-end justify-center flex-shrink-0">
          <div ref={wrapGRef} className="inline-block origin-bottom will-change-transform leading-none font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgGRef} overflow="visible" style={{ display:'block' }}>
              <text ref={txtGRef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0" dominantBaseline="auto" filter="url(#f-wobble)">G</text>
            </svg>
          </div>
          <div ref={wrapRRef} className="inline-block origin-bottom will-change-transform leading-none font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgRRef} overflow="visible" style={{ display:'block' }}>
              <text ref={txtRRef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0" dominantBaseline="auto" filter="url(#f-wobble)">R</text>
            </svg>
          </div>
          <div ref={wrapORef} className="inline-block origin-bottom will-change-transform leading-none font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgORef} overflow="visible" style={{ display:'block' }}>
              <text ref={txtORef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0" dominantBaseline="auto" filter="url(#f-wobble)">O</text>
            </svg>
          </div>
          <div ref={wrapURef} className="inline-block origin-bottom will-change-transform leading-none font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgURef} overflow="visible" style={{ display:'block' }}>
              <text ref={txtURef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0" dominantBaseline="auto" filter="url(#f-wobble)">U</text>
            </svg>
          </div>
          <div ref={wrapPRef} className="inline-block origin-bottom will-change-transform leading-none text-[1px]">
            <svg ref={svgPRef} viewBox={`0 0 ${P_ADV} ${FONT_CAP}`} style={{ display:'block', overflow:'visible' }} width="1px" height="1px">
              <g transform="scale(1,-1) translate(0,-700)" fill="#1a6be0">
                <path d={P_PATH} />
              </g>
            </svg>
          </div>
          <span className="font-['DM_Mono'] inline-block self-end"
                style={{ fontSize:'clamp(36px,5.5vw,65px)', color:'rgba(26,107,224,0.25)',
                         margin:'0 clamp(2px,0.5vw,10px)', marginBottom:'0.05em' }}>/</span>
          <div ref={wrapBRef} className="inline-block origin-bottom will-change-transform leading-none font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgBRef} overflow="visible" style={{ display:'block' }}>
              <text ref={txtBRef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0" dominantBaseline="auto" filter="url(#f-wobble)">B</text>
            </svg>
          </div>
        </div>

        <div ref={barWrapRef} className="w-full mt-5 flex flex-col items-center gap-[10px]" style={{ opacity: 0 }}>
          <div className="w-full h-[4px] relative">
            {ticks.map(i => (
              <div key={i} className="absolute top-0 w-px h-[4px]"
                   style={{ left:`${(i/20)*100}%`, background:'rgba(26,107,224,0.15)' }} />
            ))}
          </div>
          <div className="w-full h-[2px] relative overflow-hidden" style={{ background:'rgba(26,107,224,0.12)' }}>
            <div ref={barFillRef} className="absolute top-0 left-0 h-full w-0"
                 style={{ background:'#1a6be0', boxShadow:'2px 0 8px rgba(26,107,224,0.7),4px 0 16px rgba(26,107,224,0.3)' }}>
              <div className="absolute top-0 right-0 h-full w-[40px]"
                   style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)', animation:'shimmer 1.4s linear infinite' }} />
            </div>
          </div>
          <span ref={barLabelRef} className="text-[9px] tracking-[0.32em] uppercase font-['DM_Mono']"
                style={{ color:'rgba(26,107,224,0.45)' }}>initialising</span>
        </div>
      </div>

      <div
        ref={welcomeRef}
        className="font-['Bebas_Neue'] pointer-events-none"
        style={{
          position: 'fixed', top: '-200px', left: 0, zIndex: 20,
          opacity: 0, fontSize: 'clamp(20px,2.8vw,40px)',
          letterSpacing: '0.20em', color: '#1a6be0',
          transformOrigin: 'bottom center',
          textShadow: '0 2px 18px rgba(26,107,224,0.22)',
          whiteSpace: 'nowrap',
        }}
      >
        Welcome
      </div>

      <style>{`
        @keyframes shimmer { from{transform:translateX(-40px)} to{transform:translateX(40px)} }
      `}</style>
    </div>
  )
}