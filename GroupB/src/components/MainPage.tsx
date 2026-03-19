import { useState } from "react";
import ERC20Page from './ERC20page'
import TokenRegistry from './TokenRegistry'
import DeploymentChart from './DeploymentChart'
import TokenInteractionPage from '../pages/TokenInteractionPage'
import type { ITokenDetail } from "../interface/ITokenDetail";

export default function MainPage() {
  const [activeToken, setActiveToken] = useState<ITokenDetail | null>(null);
  return (
    <div className="w-full flex flex-col">
      <section className="w-full min-h-screen relative flex-shrink-0 overflow-hidden">
        <ERC20Page />
      </section>

      <section className="relative z-10 w-full flex-shrink-0" style={{ background: '#05050d' }}>
        <DeploymentChart />
      </section>

      <section className="relative z-10 w-full flex-shrink-0 py-16" style={{ background: '#05050d' }}>
        {activeToken ? (
            <TokenInteractionPage
              tokenDetail={activeToken}
              onBack={() => setActiveToken(null)}
            />
          ) : (
            <TokenRegistry onTestToken={(tokenDetail) => setActiveToken(tokenDetail)} />
          )}
      </section>
    </div>
  )
}