// import { useState } from 'react'
import ERC20Page from './ERC20page'
import TokenRegistry from './TokenRegistry'
// import SplashPage from './SplashPage'

export default function MainPage() {
  // const [splashDone, setSplashDone] = useState(false)

  // if (!splashDone) {
  //   return (
  //     <div className="w-full h-screen">
  //       <SplashPage onComplete={() => setSplashDone(true)} />
  //     </div>
  //   )
  // }

  return (
    <div className="w-full flex flex-col">
      <section className="w-full min-h-screen relative flex-shrink-0 overflow-hidden">
        <ERC20Page />
      </section>

      <section className="relative z-10 w-full flex-shrink-0 py-16" style={{ background: '#05050d' }}>
        <TokenRegistry />
      </section>
    </div>
  )
}