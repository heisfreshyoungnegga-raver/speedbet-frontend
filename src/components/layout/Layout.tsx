import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BetSlipDrawer from './BetSlipDrawer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <BetSlipDrawer />
      <Footer />
    </div>
  )
}
