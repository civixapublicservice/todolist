import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getActivities } from '../services/activityService'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

const ActivityContext = createContext(null)

export const ActivityProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchActivities = useCallback(async () => {
    if (!isAuthenticated) return
    setIsLoading(true)
    setError('')
    try {
      const data = await getActivities()
      setActivities(data)
    } catch (err) {
      setError(err.message || 'Failed to load activity log')
      toast.error('Failed to load activity log')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return (
    <ActivityContext.Provider value={{
      activities,
      isLoading,
      error,
      fetchActivities
    }}>
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivities = () => {
  const context = useContext(ActivityContext)
  if (!context) throw new Error('useActivities must be used within ActivityProvider')
  return context
}
