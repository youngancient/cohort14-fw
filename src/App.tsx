import { useState } from 'react'
import SplashPage from './components/SplashPage'
import ERC20Page from './components/ERC20page';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TokenRegistry from './components/TokenRegistry';

type Page = 'splash' | 'main' | 'tokenRegistry';

export default function App() {
  const [page, setPage] = useState<Page>('splash')

  return (
    <>
      {page === 'splash' && (
        <SplashPage onComplete={() => setPage('main')} />
      )}

      {page === 'main' && (
        <>
          <Navbar />
          <ERC20Page />
          
          <TokenRegistry/>
          <Footer/>
        </>
       )
      }
    </>
  );
};