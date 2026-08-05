// authService.js - Copy content from auth.js file I provided

export const authenticateUser = (username, password) => {
  // Validation
  if (!username.trim() || !password.trim()) {
    return {
      success: false,
      error: 'Username and password are required',
    }
  }

  if (username.length < 3) {
    return {
      success: false,
      error: 'Username must be at least 3 characters',
    }
  }

  if (password.length < 4) {
    return {
      success: false,
      error: 'Password must be at least 4 characters',
    }
  }

  // Dummy credentials
  const validUsers = {
    'ramesh': 'password123',
    'demo': 'demo123',
    'user': 'user123',
  }

  if (validUsers[username.toLowerCase()] === password) {
    return {
      success: true,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        username: username.toLowerCase(),
        email: `${username}@example.com`,
      },
    }
  }

  return {
    success: false,
    error: 'Invalid username or password',
  }
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

export const saveUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export const logoutUser = () => {
  localStorage.removeItem('currentUser')
}