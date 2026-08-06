import { fetchApi } from './api'

export const updateUserProfile = async (name, email) => {
  const data = await fetchApi('/settings/profile', {
    method: 'PUT',
    body: JSON.stringify({ name, email }),
  })
  return data
}

export const changeUserPassword = async (currentPassword, newPassword) => {
  const data = await fetchApi('/settings/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return data
}
