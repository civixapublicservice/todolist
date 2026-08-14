import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import MobileNav from '../components/MobileNav'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Top Bar */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 lg:p-8 md:pb-6 relative z-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}