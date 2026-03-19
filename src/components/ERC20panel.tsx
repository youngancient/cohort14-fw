import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ERC20PanelProps {
  visible: boolean
}

export default function ERC20Panel({ visible }: ERC20PanelProps) {
  const panelRef   = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLDivElement>(null)
  const introRef   = useRef<HTMLParagraphElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const featsRef   = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLButtonElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!visible || hasAnimated.current) return
    hasAnimated.current = true

    const panel   = panelRef.current
    const eyebrow = eyebrowRef.current
    const title   = titleRef.current
    const intro   = introRef.current
    const stats   = statsRef.current
    const feats   = featsRef.current
    const line    = lineRef.current
    const btn     = btnRef.current
    if (!panel || !eyebrow || !title || !intro || !stats || !feats || !line || !btn) return

    gsap.set([eyebrow, title, intro, stats, feats], { opacity: 0, y: 28 })
    gsap.set(line,  { scaleX: 0 })
    gsap.set(btn,   { opacity: 0, y: 18 })

    gsap.to(panel, {
      opacity: 1, duration: 1.1, ease: 'power2.out',
      onComplete() {
        gsap.timeline()
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out'    }, 0.0)
          .to(title,   { opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.1)' }, 0.2)
          .to(intro,   { opacity: 1, y: 0, duration: 0.70, ease: 'power2.out'    }, 0.55)
          .to(stats,   { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.12 }, 0.85)
          .to(line,    { scaleX: 1,  duration: 1.4, ease: 'power2.inOut'         }, 0.95)
          .to(Array.from(feats.children), {
              opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.22,
            }, 1.2)
          .to(btn,     { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.2)' }, 2.1)
      },
    })
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={panelRef}
      className="relative inset-0 z-30 flex items-center justify-center pointer-events-none"
      style={{ opacity: 0, padding: 'clamp(12px, 4vw, 80px) clamp(12px, 3vw, 48px) clamp(12px, 4vw, 80px)' }}
    >
      <div className="relative z-[1] w-full max-w-[960px] grid grid-cols-1 md:grid-cols-2 gap-x-[32px] md:gap-x-[72px] gap-y-[32px] md:gap-y-[48px] items-start px-4 md:px-0">
        <div>
          <div
            ref={eyebrowRef}
            className="text-[9px] tracking-[0.38em] uppercase mb-4 flex items-center gap-[10px]"
            style={{ color: 'var(--accent-cyan)', textShadow: '0 0 14px rgba(0, 229, 255, 0.6)' }}
          >
          </div>

          <div
            ref={titleRef}
            className="font-['Bebas_Neue'] leading-[0.92] tracking-[0.02em] mb-4 md:mb-6 text-white"
            style={{
              fontSize: 'clamp(36px, 6vw, 88px)',
              textShadow: '0 2px 40px rgba(0,0,0,0.55), 0 0 80px rgba(26,107,224,0.3)',
            }}
          >
            What is<br />ERC&#8209;20?
          </div>

          <p
            ref={introRef}
            className="font-['DM_Mono'] text-[12.5px] leading-[1.82] tracking-[0.02em]"
            style={{ color: 'rgba(255,255,255,0.80)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            ERC&#8209;20 is the technical standard that defines how fungible
            tokens live on the Ethereum blockchain. Every token that
            implements this interface — from USDC to UNI to LINK —
            exposes the same six functions and two events, making them
            instantly composable with any wallet, DEX, lending protocol,
            or bridge ever built on Ethereum.
            <br /><br />
            The standard's power is its uniformity. A DeFi protocol built
            today will work with an ERC&#8209;20 token launched five years
            from now without a single line of integration code. This is
            the foundation of permissionless finance — write once,
            interoperate everywhere.
            <br /><br />
            GROUP&nbsp;B deploys audited, gas&#8209;optimised ERC&#8209;20
            contracts directly to mainnet. Name it. Supply it. Launch it.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div ref={statsRef} className="grid grid-cols-2 gap-3">
            {[
              { val: '6',     key: 'Core functions'    },
              { val: '2',     key: 'Core events'       },
              { val: '$420B+',key: 'ERC-20 market cap' },
              { val: '2015',  key: 'EIP proposed'      },
            ].map(({ val, key }) => (
              <div
                key={key}
                className="relative  p-[14px_16px] backdrop-blur-[6px]"
                style={{
                  background: 'rgba(0,0,0,0.32)',
                  border: '1px solid rgba(0,229,255,0.22)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                     style={{ background: 'linear-gradient(90deg,transparent,rgba(0,229,255,0.6),transparent)' }} />
                <div
                  className="font-['Bebas_Neue'] text-[30px] tracking-[0.04em] leading-none"
                  style={{ color: 'var(--accent-cyan)', textShadow: '0 0 16px rgba(0,229,255,0.5)' }}
                >{val}</div>
                <div
                  className="font-['DM_Mono'] text-[8px] tracking-[0.22em] uppercase mt-1"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >{key}</div>
              </div>
            ))}
          </div>
          <div ref={featsRef} className="flex flex-col gap-0">
            {[
              {
                label: 'Fungibility',
                body:  'every token unit is identical and interchangeable, unlocking liquidity pools, lending markets, and seamless exchange listings.',
              },
              {
                label: 'Allowance model',
                body:  'approve() and transferFrom() let smart contracts move tokens on your behalf, powering DEX swaps and yield vaults without ever taking custody.',
              },
              {
                label: 'Universal composability',
                body:  'any wallet, protocol, or bridge that speaks ERC‑20 works with your token instantly. Zero bespoke integration.',
              },
            ].map(({ label, body }) => (
              <div
                key={label}
                className="flex items-start gap-3 py-[10px]"
                style={{ borderBottom: '1px solid rgba(0,229,255,0.12)' }}
              >
                <span
                  className="text-[13px] flex-shrink-0 mt-[1px]"
                  style={{ color: 'rgba(0,229,255,0.7)', textShadow: '0 0 8px rgba(0,229,255,0.5)' }}
                >◈</span>
                <span
                  className="font-['DM_Mono'] text-[11.5px] leading-[1.65] tracking-[0.01em]"
                  style={{ color: 'rgba(255,255,255,0.70)', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
                >
                  <strong style={{ color: 'var(--accent-cyan)', fontWeight: 500, textShadow: '0 0 10px rgba(0,229,255,0.4)' }}>
                    {label}
                  </strong>
                  {' — '}{body}
                </span>
              </div>
            ))}
          </div>
          <button
            ref={btnRef}
            className="inline-flex items-center gap-[10px] font-['DM_Mono'] text-[10px] tracking-[0.28em] uppercase backdrop-blur-[8px] pointer-events-auto group"
            style={{
              padding: '14px 28px',
              color: 'var(--accent-cyan)',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(0,229,255,0.45)',
              clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
              textShadow: '0 0 12px rgba(0,229,255,0.5)',
              opacity: 0,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background    = 'rgba(0,229,255,0.12)'
              el.style.borderColor   = 'rgba(0,229,255,0.85)'
              el.style.color         = '#fff'
              el.style.textShadow    = '0 0 20px rgba(0,229,255,0.8)'
              el.style.boxShadow     = '0 0 28px rgba(0,229,255,0.18), inset 0 0 20px rgba(0,229,255,0.04)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background    = 'rgba(0,0,0,0.35)'
              el.style.borderColor   = 'rgba(0,229,255,0.45)'
              el.style.color         = 'var(--accent-cyan)'
              el.style.textShadow    = '0 0 12px rgba(0,229,255,0.5)'
              el.style.boxShadow     = ''
            }}
          >
            Create Token
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>

        </div>
      </div>
      <div
        ref={lineRef}
        className="absolute"
        style={{
          bottom: '52px', left: '10%', right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(0,234,255,0.35),transparent)',
          boxShadow: '0 0 8px rgba(0,234,255,0.2)',
          transformOrigin: 'left center',
        }}
      />
    </div>
  )
}