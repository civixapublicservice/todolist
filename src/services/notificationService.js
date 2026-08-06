import { fetchApi } from './api'

export const getNotifications = async (unreadOnly = false) => {
  const data = await fetchApi(`/notifications?unreadOnly=${unreadOnly}`)
  return data
}

export const markNotificationAsRead = async (id) => {
  const data = await fetchApi(`/notifications/${id}/read`, {
    method: 'PATCH',
  })
  return data
}

export const markAllNotificationsAsRead = async () => {
  const data = await fetchApi('/notifications/read-all', {
    method: 'PATCH',
  })
  return data
}
