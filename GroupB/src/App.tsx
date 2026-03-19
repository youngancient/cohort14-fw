import MainPage from './components/MainPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: '#000000' }}>
      <Navbar />
      <MainPage />
      <Footer />
    </div>
  )
}