import Sidebar from '../components/Sidebar'
import Header from '../components/Header'


export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Top Bar */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}