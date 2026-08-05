import { LogOut, Moon, Sun, CheckSquare } from 'lucide-react'
import '../styles/navbar.css'

export default function Navbar({ user, onLogout, isDark, onThemeToggle }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <CheckSquare size={28} className="brand-icon" />
          <span className="brand-text">TaskFlow</span>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <span className="username">Welcome, {user?.username}!</span>
          </div>

          <button
            className="btn btn-secondary btn-small navbar-button"
            onClick={onThemeToggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn btn-danger btn-small navbar-button"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}