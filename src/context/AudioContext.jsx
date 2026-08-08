import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { getUserSettings } from '../services/settingsService'
import { useAuth } from '../hooks/useAuth'

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [uiSoundsEnabled, setUiSoundsEnabled] = useState(true)
  const [notifSoundsEnabled, setNotifSoundsEnabled] = useState(true)

  // Audio references
  const uiAudioRef = useRef(null)
  const notifAudioRef = useRef(null)

  // Load preferences from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getUserSettings().then(settings => {
        if (settings) {
          setUiSoundsEnabled(settings.uiSounds ?? true)
          setNotifSoundsEnabled(settings.notificationSounds ?? true)
        }
      }).catch(err => console.error("Failed to load audio settings:", err))
    }
  }, [isAuthenticated])

  // Initialize audio elements once
  useEffect(() => {
    // Only create audio elements in browser
    if (typeof window !== 'undefined') {
      uiAudioRef.current = new Audio('/sounds/ui-click.wav')
      uiAudioRef.current.volume = 0.3
      
      notifAudioRef.current = new Audio('/sounds/notif-chime.wav')
      notifAudioRef.current.volume = 0.4
    }
    
    return () => {
      if (uiAudioRef.current) {
        uiAudioRef.current.pause()
        uiAudioRef.current = null
      }
      if (notifAudioRef.current) {
        notifAudioRef.current.pause()
        notifAudioRef.current = null
      }
    }
  }, [])

  // External functions exposed via context
  const playUISound = useCallback((type = 'toggle') => {
    if (!uiSoundsEnabled || !uiAudioRef.current) return
    
    // We clone the node or reset currentTime to allow overlapping sounds (e.g. rapid clicks)
    // However, rapid clicking might sound bad. Resetting time is generally fine.
    try {
      uiAudioRef.current.currentTime = 0
      const playPromise = uiAudioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          // Autoplay policy prevented playback, ignore silently
          console.debug("Audio playback prevented:", e)
        })
      }
    } catch (e) {
      // Ignore
    }
  }, [uiSoundsEnabled])

  const playNotificationSound = useCallback(() => {
    if (!notifSoundsEnabled || !notifAudioRef.current) return
    
    try {
      notifAudioRef.current.currentTime = 0
      const playPromise = notifAudioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          // Autoplay policy prevented playback, ignore silently
          console.debug("Audio playback prevented:", e)
        })
      }
    } catch (e) {
      // Ignore
    }
  }, [notifSoundsEnabled])
  
  // Method to update settings locally when changed in SettingsPage
  const updateAudioPreferences = useCallback((ui, notif) => {
    if (ui !== undefined) setUiSoundsEnabled(ui)
    if (notif !== undefined) setNotifSoundsEnabled(notif)
  }, [])

  return (
    <AudioContext.Provider value={{ playUISound, playNotificationSound, updateAudioPreferences }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    // Return mock functions if used outside provider
    return { 
      playUISound: () => {}, 
      playNotificationSound: () => {},
      updateAudioPreferences: () => {}
    }
  }
  return context
}
