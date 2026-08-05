import { useState, useEffect } from 'react'

const THEME_STORAGE_KEY = 'todo-app-theme'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored !== null) {
      return JSON.parse(stored)
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDark))
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return { isDark, toggleTheme }
}