import { useState, useEffect, useCallback } from 'react'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from '../services/notificationService'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications(false) // get all
      
      setNotifications(prevNotifications => {
        // Find new unread notifications that were just fetched
        const prevIds = new Set(prevNotifications.map(n => n.id))
        const newUnread = data.filter(n => !prevIds.has(n.id) && !n.isRead)

        // Show browser notifications for new unread notifications
        if (newUnread.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
          setTimeout(() => {
            newUnread.forEach(notif => {
              try {
                new Notification('TaskFlow Reminder', {
                  body: notif.message,
                  icon: '/favicon.svg', // Assumes a favicon or logo is here
                  badge: '/favicon.svg'
                })
              } catch (err) {
                console.error('Browser notification error:', err)
              }
            })
          }, 0)
        }
        
        return data
      })
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }, [])

  // Initial fetch and request permission
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [fetchNotifications])

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.filter(n => n.id !== id))
      await deleteNotification(id)
    } catch (err) {
      console.error('Failed to delete notification', err)
      fetchNotifications() // Revert on failure
    }
  }

  const handleDeleteAll = async () => {
    try {
      setNotifications([]) // Optimistic update
      await deleteAllNotifications()
    } catch (err) {
      console.error('Failed to delete all notifications', err)
      fetchNotifications() // Revert on failure
    }
  }

  return {
    notifications,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllRead,
    handleDelete,
    handleDeleteAll,
    refresh: fetchNotifications
  }
}
