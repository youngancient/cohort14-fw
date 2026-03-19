'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import FXCanvas from './FXCanvas'
import CryptoTicker from './CryptoTicker'
import ERC20Panel from './ERC20panel'
import { useGroupBAnimation  } from './hooks/useGroupBAnimation'
import type { AnimationRefs, AnimationPhase } from './hooks/useGroupBAnimation'
// ── P glyph path — exact Bebas Neue font data ──────────────────
const P_PATH = 'M41 700H203Q285 700 326.0 656.0Q367 612 367 527V458Q367 373 326.0 329.0Q285 285 203 285H151V0H41ZM203 385Q230 385 243.5 400.0Q257 415 257 451V534Q257 570 243.5 585.0Q230 600 203 600H151V385Z'
const P_ADV   = 386
const FONT_CAP = 700

export default function GroupBHero() {
  // ── Refs for letter elements ────────────────────────────────
  const wrapGRef = useRef<HTMLDivElement>(null)
  const wrapRRef = useRef<HTMLDivElement>(null)
  const wrapORef = useRef<HTMLDivElement>(null)
  const wrapURef = useRef<HTMLDivElement>(null)
  const wrapPRef = useRef<HTMLDivElement>(null)
  const wrapBRef = useRef<HTMLDivElement>(null)
  const barWrapRef  = useRef<HTMLDivElement>(null)
  const barFillRef  = useRef<HTMLDivElement>(null)
  const barLabelRef = useRef<HTMLSpanElement>(null)

  // SVG text refs for sizing
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

  const [fxActive, setFxActive] = useState(true)
  const [phase, setPhase] = useState<AnimationPhase>('intro')
  const tugRef = useRef({ t: 0 })
  const applyFontSize = useCallback(() => {
    const FS    = Math.min(Math.floor(window.innerWidth * 0.22), 300)
    const SCALE = FS / FONT_CAP

    const letters = [
      { txt: txtGRef.current, svg: svgGRef.current },
      { txt: txtRRef.current, svg: svgRRef.current },
      { txt: txtORef.current, svg: svgORef.current },
      { txt: txtURef.current, svg: svgURef.current },
      { txt: txtBRef.current, svg: svgBRef.current },
    ]

    letters.forEach(({ txt, svg }) => {
      if (!txt || !svg) return
      txt.setAttribute('font-size', FS + 'px')
      txt.setAttribute('x', '0')
      txt.setAttribute('y', FS + 'px')
      const bb = txt.getBBox?.() ?? { width: FS * 0.65, height: FS, x: 0, y: 0 }
      txt.setAttribute('x', (-bb.x) + 'px')
      svg.setAttribute('width',   (bb.width  + 4) + 'px')
      svg.setAttribute('height',  (bb.height + 4) + 'px')
      svg.setAttribute('viewBox', `${bb.x - 2} ${bb.y - 2} ${bb.width + 4} ${bb.height + 4}`)
    })

    const svgP = svgPRef.current
    if (svgP) {
      svgP.setAttribute('width',   P_ADV   * SCALE + 'px')
      svgP.setAttribute('height',  FONT_CAP * SCALE + 'px')
      svgP.setAttribute('viewBox', `0 0 ${P_ADV} ${FONT_CAP}`)
    }
  }, [])


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

  const { runLoop } = useGroupBAnimation(
    getAnimRefs,
    setPhase,
    setFxActive,
    tugRef
  )
  useEffect(() => {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          applyFontSize()
          runLoop()
        })
      })
    })
    window.addEventListener('resize', applyFontSize)
    return () => window.removeEventListener('resize', applyFontSize)
  }, [])

  const ticks = Array.from({ length: 19 }, (_, i) => i + 1)

  return (
    <div className="w-full h-full  bg-white font-['DM_Mono']">

      <video
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-0 transition-opacity duration-[600ms]"
        src="waves.mp4"
        autoPlay loop muted playsInline
        onCanPlay={e => { (e.currentTarget as HTMLVideoElement).style.opacity = '1' }}
        onError={e => { (e.currentTarget as HTMLVideoElement).remove() }}
      />

      <svg
        style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="f-wobble" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence
              id="ft-turb"
              type="fractalNoise"
              baseFrequency="0.018 0.022"
              numOctaves={3}
              seed={8}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic" in2="noise"
              scale={3}
              xChannelSelector="R" yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

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
        <span
          className="w-[6px] h-[6px] flex-shrink-0"
          style={{
            background: '#d4af37',
            clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
            boxShadow: '0 0 8px rgba(212,175,55,0.8)',
            animation: 'gemPulse 2.4s ease-in-out infinite',
          }}
        />
        Connect Wallet
      </button>

      <FXCanvas
        active={fxActive}
        tugRef={tugRef}
        wrapPRef={wrapPRef as React.RefObject<HTMLDivElement>}
        wrapBRef={wrapBRef as React.RefObject<HTMLDivElement>}
      />

      <div
        className="fixed top-1/2 left-1/2 flex flex-col items-center justify-center z-10 pointer-events-none"
        style={{ transform: 'translate(-50%, -54%)' }}
        id="hero-row"
      >
        <div className="flex items-end justify-center flex-shrink-0">

          <div ref={wrapGRef} className="inline-block origin-bottom will-change-transform leading-none text-[#1a6be0] font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgGRef} overflow="visible" style={{ display: 'block' }}>
              <text ref={txtGRef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0"
                    dominantBaseline="auto" filter="url(#f-wobble)">G</text>
            </svg>
          </div>

          <div ref={wrapRRef} className="inline-block origin-bottom will-change-transform leading-none text-[#1a6be0] font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgRRef} overflow="visible" style={{ display: 'block' }}>
              <text ref={txtRRef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0"
                    dominantBaseline="auto" filter="url(#f-wobble)">R</text>
            </svg>
          </div>

          <div ref={wrapORef} className="inline-block origin-bottom will-change-transform leading-none text-[#1a6be0] font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgORef} overflow="visible" style={{ display: 'block' }}>
              <text ref={txtORef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0"
                    dominantBaseline="auto" filter="url(#f-wobble)">O</text>
            </svg>
          </div>

          <div ref={wrapURef} className="inline-block origin-bottom will-change-transform leading-none text-[#1a6be0] font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgURef} overflow="visible" style={{ display: 'block' }}>
              <text ref={txtURef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0"
                    dominantBaseline="auto" filter="url(#f-wobble)">U</text>
            </svg>
          </div>

          <div ref={wrapPRef} className="inline-block origin-bottom will-change-transform leading-none text-[1px]">
            <svg
              ref={svgPRef}
              viewBox={`0 0 ${P_ADV} ${FONT_CAP}`}
              style={{ display: 'block', overflow: 'visible' }}
              width="1px" height="1px"
            >
              <g transform="scale(1,-1) translate(0,-700)" fill="#1a6be0">
                <path d={P_PATH} />
              </g>
            </svg>
          </div>
          <span
            className="font-['DM_Mono'] inline-block self-end"
            style={{
              fontSize: 'clamp(36px,5.5vw,65px)',
              color: 'rgba(26,107,224,0.25)',
              margin: '0 clamp(2px,0.5vw,10px)',
              marginBottom: '0.05em',
            }}
          >/</span>
          <div ref={wrapBRef} className="inline-block origin-bottom will-change-transform leading-none text-[#1a6be0] font-['Bebas_Neue'] text-[1px]">
            <svg ref={svgBRef} overflow="visible" style={{ display: 'block' }}>
              <text ref={txtBRef} fontFamily="'Bebas Neue',cursive" fill="#1a6be0"
                    dominantBaseline="auto" filter="url(#f-wobble)">B</text>
            </svg>
          </div>

        </div>
        <div
          ref={barWrapRef}
          className="w-full mt-7 flex flex-col items-center gap-[10px]"
          style={{ opacity: 0 }}
        >
          <div className="w-full h-[4px] relative">
            {ticks.map(i => (
              <div
                key={i}
                className="absolute top-0 w-px h-[4px]"
                style={{
                  left: `${(i / 20) * 100}%`,
                  background: 'rgba(26,107,224,0.15)',
                }}
              />
            ))}
          </div>
          <div
            className="w-full h-[2px] relative overflow-hidden"
            style={{ background: 'rgba(26,107,224,0.12)' }}
          >
            <div
              ref={barFillRef}
              className="absolute top-0 left-0 h-full w-0"
              style={{
                background: '#1a6be0',
                boxShadow: '2px 0 8px rgba(26,107,224,0.7), 4px 0 16px rgba(26,107,224,0.3)',
              }}
            >
              <div
                className="absolute top-0 right-0 h-full w-[40px]"
                style={{
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)',
                  animation: 'shimmer 1.4s linear infinite',
                }}
              />
            </div>
          </div>
          <span
            ref={barLabelRef}
            className="text-[9px] tracking-[0.32em] uppercase font-['DM_Mono']"
            style={{ color: 'rgba(26,107,224,0.45)' }}
          >
            initialising
          </span>
        </div>
      </div>
      <ERC20Panel visible={phase === 'panel'} />
      <CryptoTicker />
      <style>{`
        @keyframes shimmer {
          from { transform: translateX(-40px); }
          to   { transform: translateX(40px);  }
        }
        @keyframes gemPulse {
          0%,100% { box-shadow: 0 0 6px rgba(212,175,55,0.7); }
          50%     { box-shadow: 0 0 14px rgba(212,175,55,1), 0 0 24px rgba(212,175,55,0.4); }
        }
      `}</style>
    </div>
  )
}