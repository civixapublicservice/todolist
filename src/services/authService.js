import { fetchApi } from './api'

export const registerUser = async (name, email, password) => {
  const data = await fetchApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  return data
}

export const loginUser = async (email, password) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const data = await fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, timezone }),
  })
  if (data.token) {
    localStorage.setItem('auth_token', data.token)
  }
  return data
}

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return null
  try {
    const data = await fetchApi('/api/auth/me')
    return data.user
  } catch {
    localStorage.removeItem('auth_token')
    return null
  }
}

export const logoutUser = () => {
  localStorage.removeItem('auth_token')
}

export const forgotPassword = async (email) => {
  const data = await fetchApi('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return data
}

export const verifyOtp = async (email, otp) => {
  const data = await fetchApi('/api/auth/verify-reset-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
  return data
}

export const resetPassword = async (resetToken, newPassword) => {
  const data = await fetchApi('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword }),
  })
  return data
}

export const verifyRegistration = async (email, otp) => {
  const data = await fetchApi('/api/auth/verify-registration', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
  return data
}

export const resendRegistrationOtp = async (email) => {
  const data = await fetchApi('/api/auth/resend-registration-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return data
}

export const changeRegistrationEmail = async (oldEmail, newEmail) => {
  const data = await fetchApi('/api/auth/change-registration-email', {
    method: 'POST',
    body: JSON.stringify({ oldEmail, newEmail }),
  })
  return data
}