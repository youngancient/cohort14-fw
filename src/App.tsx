import { useState } from 'react'
import SplashPage from './components/SplashPage'
import ERC20Page from './components/ERC20page'
import './App.css'

type Page = 'splash' | 'erc20'

export default function App() {
  const [page, setPage] = useState<Page>('splash')

  return (
    <div className="w-screen h-screen overflow-hidden">
      {page === 'splash' && (
        <SplashPage onComplete={() => setPage('erc20')} />
      )}
      {page === 'erc20' && (
        <ERC20Page />
      )}
    </div>
  )
}