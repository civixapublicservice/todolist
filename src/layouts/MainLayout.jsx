import Navbar from '../components/Navbar'
import '../styles/app.css'

export default function MainLayout({
  children,
  user,
  onLogout,
  isDark,
  onThemeToggle,
}) {
  return (
    <div className="app">
      <Navbar
        user={user}
        onLogout={onLogout}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
      />
      <main className="app-main">
        <div className="app-container">
          {children}
        </div>
      </main>
      <footer className="app-footer">
        <p>
          TaskFlow © {new Date().getFullYear()} | Built with React + Vite
        </p>
      </footer>
    </div>
  )
}