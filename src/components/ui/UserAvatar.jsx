import { User } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function UserAvatar({ user, className }) {
  // Try to get the first letter of the user's name, fallback to a User icon
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-full",
      "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md",
      "border-2 border-background dark:border-[#121212]",
      "overflow-hidden",
      className
    )}>
      {/* Subtle inner lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_50%)]"></div>
      
      {initial ? (
        <span className="text-white font-bold tracking-tight relative z-10 w-full h-full flex items-center justify-center text-lg">
          {initial}
        </span>
      ) : (
        <User className="w-[55%] h-[55%] text-white relative z-10" strokeWidth={2.5} />
      )}
    </div>
  )
}
