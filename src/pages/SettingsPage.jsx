import { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile, changeUserPassword, getUserSettings, updateUserSettings } from '../services/settingsService'
import { Settings as SettingsIcon, User, Mail, Lock, LogOut, CheckCircle2, AlertCircle, Sparkles, Bell, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '../utils/cn'

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // App settings state
  const [theme, setTheme] = useState('dark')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getUserSettings()
        setTheme(data.theme || 'dark')
        setEmailAlerts(data.emailAlerts ?? true)
        setWeeklyDigest(data.weeklyDigest ?? true)
      } catch (err) {
        toast.error('Failed to load user settings')
      } finally {
        setIsLoadingSettings(false)
      }
    }
    loadSettings()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const data = await updateUserProfile(name, email)
      updateUser({ name: data.user?.name || name, email: data.user?.email || email })
      toast.success('Profile updated successfully', { icon: '✨' })
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsUpdatingPassword(true)

    try {
      await changeUserPassword(currentPassword, newPassword)
      toast.success('Password changed successfully', { icon: '🔐' })
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleUpdateSettings = async (e) => {
    e.preventDefault()
    setIsUpdatingSettings(true)

    try {
      await updateUserSettings({ theme, emailAlerts, weeklyDigest })
      toast.success('App preferences updated successfully', { icon: '⚙️' })
    } catch (err) {
      toast.error(err.message || 'Failed to update settings')
    } finally {
      setIsUpdatingSettings(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full">
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-glow"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Account Preferences</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">Settings</h1>
            <p className="text-white/80 text-sm max-w-md font-medium">
              Manage your profile details, security credentials, and app preferences.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Profile Information Form */}
          <div className="glass-card border border-glass-border rounded-xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
                <User className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Profile Information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    disabled={isUpdatingProfile}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    disabled={isUpdatingProfile}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary self-start shadow-md py-2.5 px-6"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <div className="spinner mr-2 border-white border-t-transparent"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </form>
          </div>

          {/* App Preferences */}
          <div className="glass-card border border-glass-border rounded-xl p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary opacity-50"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-accent/10 p-2 rounded-xl text-accent border border-accent/20">
                <SettingsIcon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-foreground">App Preferences</h3>
            </div>

            {isLoadingSettings ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8"></div>
              </div>
            ) : (
              <form onSubmit={handleUpdateSettings} className="flex flex-col gap-6">
                
                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" /> Theme
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Select your preferred color scheme.</p>
                  </div>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="glass-input text-sm py-2 px-3 rounded-lg border-glass-border focus:border-primary w-32"
                    disabled={isUpdatingSettings}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" /> Email Alerts
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Receive email notifications for deadlines.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      disabled={isUpdatingSettings}
                    />
                    <div className="w-11 h-6 bg-muted/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" /> Weekly Digest
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Get a weekly summary of your tasks.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      disabled={isUpdatingSettings}
                    />
                    <div className="w-11 h-6 bg-muted/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn glass-button border-primary/50 hover:bg-primary/10 text-primary self-start py-2.5 px-6 font-bold"
                  disabled={isUpdatingSettings}
                >
                  {isUpdatingSettings ? (
                    <>
                      <div className="spinner mr-2 border-primary border-t-transparent"></div>
                      <span>Saving Preferences...</span>
                    </>
                  ) : (
                    <span>Save Preferences</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Change Password Form */}
          <div className="glass-card border border-glass-border rounded-xl p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
                <Lock className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Security & Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn glass-button border-primary/50 hover:bg-primary/10 text-primary self-start py-2.5 px-6 font-bold"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <div className="spinner mr-2 border-primary border-t-transparent"></div>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>

          {/* Preferences & Logout Card */}
          <div className="glass-card border border-glass-border rounded-xl p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
             <div className="absolute left-0 top-0 w-1 h-full bg-destructive opacity-50"></div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Danger Zone</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Log out of your account on this device.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center justify-center space-x-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-lg hover:shadow-destructive/20 rounded-xl px-6 py-3 text-sm font-bold transition-all"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" strokeWidth={2.5} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
