import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile, changeUserPassword, getUserSettings, updateUserSettings } from '../services/settingsService'
import { Settings as SettingsIcon, User, Mail, Lock, LogOut, AlertCircle, Sparkles, Bell, Palette, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import ToggleSwitch from '../components/ui/ToggleSwitch'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../utils/cn'

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // App settings state
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [globalEmailReminder, setGlobalEmailReminder] = useState(true)
  const [globalBrowserNotification, setGlobalBrowserNotification] = useState(true)

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getUserSettings()
        setEmailAlerts(data.emailAlerts ?? true)
        setPushNotifications(data.pushNotifications ?? true)
        setTimezone(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
        setGlobalEmailReminder(data.globalEmailReminder ?? true)
        setGlobalBrowserNotification(data.globalBrowserNotification ?? true)
      } catch (err) {
        console.error(err)
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
      toast.success('Profile updated successfully')
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
      toast.success('Password changed successfully')
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
      await updateUserSettings({ 
        theme: globalTheme, 
        emailAlerts, 
        pushNotifications,
        timezone,
        globalEmailReminder,
        globalBrowserNotification
      })
      toast.success('App preferences updated successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to update settings')
    } finally {
      setIsUpdatingSettings(false)
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="bg-gradient-to-r from-primary to-accent text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-xl"
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
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Profile Information Form */}
          <div className="glass-card border border-glass-border rounded-2xl p-8 shadow-sm relative overflow-hidden">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input bg-foreground/5 hover:bg-foreground/10 focus:bg-background border-transparent focus:border-primary transition-all duration-300 disabled:opacity-50 !rounded-xl font-medium"
                    disabled={isUpdatingProfile}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>Email Address</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                    Verified
                  </span>
                </label>
                <div 
                  className="flex items-center w-full px-4 py-3 bg-foreground/5 border border-glass-border rounded-xl cursor-not-allowed"
                  title="Email address cannot be changed from this panel."
                >
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="text-sm font-medium text-foreground/80 select-none truncate">{email}</span>
                  <Lock className="h-4 w-4 text-muted-foreground/40 ml-auto shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                  To change your registered email address, please contact support.
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary self-start shadow-md py-2.5 px-6 !rounded-xl mt-2"
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
          <div className="glass-card border border-glass-border rounded-2xl p-8 shadow-sm relative overflow-hidden">
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
                
                <div className="flex flex-col gap-3 border-b border-glass-border pb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" /> Theme
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Select your preferred color scheme.</p>
                  </div>
                  <div className="flex bg-foreground/5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full sm:w-fit border border-glass-border">
                    {['dark', 'light', 'system'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={isUpdatingSettings}
                        onClick={() => {
                          setGlobalTheme(t);
                        }}
                        className={cn(
                          "flex-1 sm:w-32 px-4 py-2.5 sm:py-3 sm:px-6 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl capitalize transition-all duration-200",
                          globalTheme === t 
                            ? "bg-background text-primary shadow-md ring-1 ring-primary/20 scale-[1.02]" 
                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" /> Email Alerts
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Receive email notifications for deadlines.</p>
                  </div>
                  <ToggleSwitch 
                    checked={emailAlerts} 
                    onChange={setEmailAlerts} 
                    disabled={isUpdatingSettings} 
                  />
                </div>

                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" /> Push Notifications
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Get instant updates for your tasks.</p>
                  </div>
                  <ToggleSwitch 
                    checked={pushNotifications} 
                    onChange={setPushNotifications} 
                    disabled={isUpdatingSettings} 
                  />
                </div>

                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" /> Task Email Reminders
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Receive automatic emails before tasks are due.</p>
                  </div>
                  <ToggleSwitch 
                    checked={globalEmailReminder} 
                    onChange={setGlobalEmailReminder} 
                    disabled={isUpdatingSettings} 
                  />
                </div>

                <div className="flex items-center justify-between border-b border-glass-border pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" /> Browser Notification Reminders
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">Display native notifications when tasks are due.</p>
                  </div>
                  <ToggleSwitch 
                    checked={globalBrowserNotification} 
                    onChange={async (val) => {
                      if (val) {
                        if ('Notification' in window) {
                          const permission = await Notification.requestPermission()
                          if (permission === 'granted') {
                            setGlobalBrowserNotification(true)
                          } else {
                            toast.error('Browser notification permission denied')
                            setGlobalBrowserNotification(false)
                          }
                        }
                      } else {
                        setGlobalBrowserNotification(false)
                      }
                    }} 
                    disabled={isUpdatingSettings} 
                  />
                </div>



                <button
                  type="submit"
                  className="btn bg-foreground/5 hover:bg-foreground/10 border border-glass-border text-foreground self-start py-2.5 px-6 !rounded-xl font-semibold mt-2 transition-all duration-300"
                  disabled={isUpdatingSettings}
                >
                  {isUpdatingSettings ? (
                    <>
                      <div className="spinner mr-2 border-foreground border-t-transparent"></div>
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
          <div className="glass-card border border-glass-border rounded-2xl p-8 shadow-sm relative overflow-hidden">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input bg-foreground/5 hover:bg-foreground/10 focus:bg-background border-transparent focus:border-primary transition-all duration-300 disabled:opacity-50 !rounded-xl font-medium"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground z-10">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 text-sm glass-input bg-foreground/5 hover:bg-foreground/10 focus:bg-background border-transparent focus:border-primary transition-all duration-300 disabled:opacity-50 !rounded-xl font-medium"
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn bg-foreground/5 hover:bg-foreground/10 border border-glass-border text-foreground self-start py-2.5 px-6 !rounded-xl font-semibold mt-2 transition-all duration-300"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <div className="spinner mr-2 border-foreground border-t-transparent"></div>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>

          {/* Preferences & Logout Card */}
          <div className="glass-card border border-glass-border rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
            <div>
              <h3 className="text-lg font-bold text-foreground">Session Management</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Securely log out of your account on this device.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center justify-center space-x-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl px-6 py-3 text-sm font-bold transition-all border border-rose-200 dark:border-rose-500/20"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" strokeWidth={2.5} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
