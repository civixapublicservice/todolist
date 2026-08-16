import { fetchApi } from './api'

export const getNotifications = async (unreadOnly = false) => {
  const data = await fetchApi(`/api/notifications?unreadOnly=${unreadOnly}`)
  return data
}

export const markNotificationAsRead = async (id) => {
  const data = await fetchApi(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  })
  return data
}

export const markAllNotificationsAsRead = async () => {
  const data = await fetchApi('/api/notifications/read-all', {
    method: 'PATCH',
  })
  return data
}

export const deleteNotification = async (id) => {
  const data = await fetchApi(`/api/notifications/${id}`, {
    method: 'DELETE',
  })
  return data
}

export const deleteAllNotifications = async () => {
  const data = await fetchApi('/api/notifications', {
    method: 'DELETE',
  })
  return data
}
