import { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getActivities } from '../services/activityService'
import { Activity, Clock, CheckCircle2, UserPlus, LogIn, Edit, Trash2, PlusCircle, AlertCircle } from 'lucide-react'

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadActivities() {
      setIsLoading(true)
      setError('')
      try {
        const data = await getActivities()
        setActivities(data)
      } catch (err) {
        setError(err.message || 'Failed to load activity log')
      } finally {
        setIsLoading(false)
      }
    }
    loadActivities()
  }, [])

  const getActivityIcon = (action) => {
    switch (action) {
      case 'USER_REGISTERED':
        return <UserPlus size={18} color="#10B981" />
      case 'USER_LOGGED_IN':
        return <LogIn size={18} color="#3B82F6" />
      case 'TASK_CREATED':
        return <PlusCircle size={18} color="#8B5CF6" />
      case 'TASK_UPDATED':
        return <Edit size={18} color="#F59E0B" />
      case 'TASK_COMPLETED':
        return <CheckCircle2 size={18} color="#10B981" />
      case 'TASK_DELETED':
        return <Trash2 size={18} color="#EF4444" />
      default:
        return <Activity size={18} color="#6366F1" />
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium mb-3">
              <Activity className="h-3.5 w-3.5" />
              <span>Audit Trail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Activity Log</h1>
            <p className="text-primary-foreground/80 text-sm max-w-md">
              Chronological log of all security events and task operations for your account.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8"></div>
            <p className="text-sm font-medium text-muted-foreground">Loading activity records...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Activity Recorded</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Events will appear here as you create, update, and manage tasks.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl shadow-sm p-2 sm:p-6">
            <div className="flex flex-col space-y-4">
              {activities.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                    index !== activities.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 shadow-sm border border-border">
                    {getActivityIcon(item.action)}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-medium text-sm text-foreground break-words">
                      {item.details}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: 'numeric', minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
