export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email address is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address'
  }
  return null
}

export const analyzePassword = (password) => {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password),
  }

  const score = Object.values(rules).filter(Boolean).length

  let strength = 'Very Weak'
  let color = 'bg-red-500'

  if (password.length === 0) {
    strength = 'Very Weak'
    color = 'bg-neutral-300 dark:bg-neutral-700'
  } else if (score === 1) {
    strength = 'Very Weak'
    color = 'bg-red-500'
  } else if (score === 2) {
    strength = 'Weak'
    color = 'bg-orange-500'
  } else if (score === 3) {
    strength = 'Fair'
    color = 'bg-yellow-500'
  } else if (score === 4) {
    if (password.length >= 10) {
      strength = 'Good'
      color = 'bg-lime-500'
    } else {
      strength = 'Fair'
      color = 'bg-yellow-500'
    }
  } else if (score === 5) {
    if (password.length >= 12) {
      strength = 'Excellent'
      color = 'bg-emerald-600'
    } else {
      strength = 'Strong'
      color = 'bg-green-500'
    }
  }

  return {
    rules,
    isValid: score === 5,
    strength,
    color,
    score,
  }
}

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required'
  }
  
  const { rules, isValid } = analyzePassword(password)
  
  if (!isValid) {
    if (!rules.length) return 'Password must be at least 8 characters'
    if (!rules.uppercase) return 'Password must contain at least one uppercase letter'
    if (!rules.lowercase) return 'Password must contain at least one lowercase letter'
    if (!rules.number) return 'Password must contain at least one number'
    if (!rules.special) return 'Password must contain at least one special character'
  }
  
  return null
}

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'Full name is required'
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters'
  }
  return null
}
