import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Logo({ className }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30 overflow-hidden", 
      className
    )}>
      {/* Glassmorphic lighting effect */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_50%)]"></div>
      
      {/* Thick, confident checkmark */}
      <Check className="w-[65%] h-[65%] text-white relative z-10" strokeWidth={4} />
      
      {/* Deep inner shadow / glow */}
      <div className="absolute -bottom-2 -right-2 w-full h-full bg-blue-900/20 rounded-full blur-md"></div>
    </div>
  )
}
