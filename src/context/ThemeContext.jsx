import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)
const THEME_STORAGE_KEY = 'todo-app-theme-preference'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      return stored.replace(/['"]/g, '')
    }
    
    // Migration from old boolean
    const oldStored = localStorage.getItem('todo-app-theme')
    if (oldStored !== null) {
      const isDarkOld = JSON.parse(oldStored)
      return isDarkOld ? 'dark' : 'light'
    }
    
    return 'system'
  })

  const [isDark, setIsDark] = useState(false)

  const applyTheme = useCallback((currentTheme) => {
    let effectiveIsDark = false
    
    if (currentTheme === 'dark') {
      effectiveIsDark = true
    } else if (currentTheme === 'light') {
      effectiveIsDark = false
    } else if (currentTheme === 'system') {
      effectiveIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    setIsDark(effectiveIsDark)

    if (effectiveIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme(theme)
  }, [theme, applyTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyTheme])

  useEffect(() => {
    const handleSync = (e) => {
      const backendTheme = e.detail;
      if (backendTheme && ['light', 'dark', 'system'].includes(backendTheme)) {
        setThemeState((prev) => {
          if (prev !== backendTheme) {
            return backendTheme;
          }
          return prev;
        });
      }
    };
    window.addEventListener('auth:sync-theme', handleSync);
    return () => window.removeEventListener('auth:sync-theme', handleSync);
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === 'system') {
        const isCurrentlyDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return isCurrentlyDark ? 'light' : 'dark'
      }
      return prev === 'dark' ? 'light' : 'dark'
    })
  }, [])

  const value = {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function useThemeContext() {
  return useTheme()
}
