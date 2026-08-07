import { fetchApi } from './api'

export const registerUser = async (name, email, password) => {
  const data = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  return data
}

export const loginUser = async (email, password) => {
  const data = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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
    const data = await fetchApi('/auth/me')
    return data.user
  } catch (error) {
    localStorage.removeItem('auth_token')
    return null
  }
}

export const logoutUser = () => {
  localStorage.removeItem('auth_token')
}

export const forgotPassword = async (email) => {
  const data = await fetchApi('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return data
}

export const verifyOtp = async (email, otp) => {
  const data = await fetchApi('/auth/verify-reset-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
  return data
}

export const resetPassword = async (resetToken, newPassword) => {
  const data = await fetchApi('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword }),
  })
  return data
}

export const verifyRegistration = async (email, otp) => {
  const data = await fetchApi('/auth/verify-registration', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
  return data
}

export const resendRegistrationOtp = async (email) => {
  const data = await fetchApi('/auth/resend-registration-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return data
}

export const changeRegistrationEmail = async (oldEmail, newEmail) => {
  const data = await fetchApi('/auth/change-registration-email', {
    method: 'POST',
    body: JSON.stringify({ oldEmail, newEmail }),
  })
  return data
}