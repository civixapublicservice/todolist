import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile, changeUserPassword } from '../services/settingsService'
import { Settings, User, Mail, Lock, LogOut, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileSuccess('')
    setProfileError('')
    setIsUpdatingProfile(true)

    try {
      const data = await updateUserProfile(name, email)
      updateUser({ name: data.user?.name || name, email: data.user?.email || email })
      setProfileSuccess('Profile details updated successfully')
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordSuccess('')
    setPasswordError('')
    setIsUpdatingPassword(true)

    try {
      await changeUserPassword(currentPassword, newPassword)
      setPasswordSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium mb-3">
              <Settings className="h-3.5 w-3.5" />
              <span>Account Preferences</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-primary-foreground/80 text-sm max-w-md">
              Manage your profile details, security credentials, and theme options.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Profile Information Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
            </div>

            {profileSuccess && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success text-success text-sm rounded-lg mb-4">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUpdatingProfile}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUpdatingProfile}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 self-start"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Security & Password</h3>
            </div>

            {passwordSuccess && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success text-success text-sm rounded-lg mb-4">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUpdatingPassword}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUpdatingPassword}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 self-start"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Preferences & Logout Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Theme Preference</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You can toggle the theme from the navigation bar.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
