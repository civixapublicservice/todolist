import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        boxShadow: checked 
          ? '0 0 12px color-mix(in srgb, var(--primary) 50%, transparent)' 
          : undefined
      }}
      className={cn(
        "relative w-[46px] h-[26px] sm:w-14 sm:h-8 rounded-full flex items-center p-[3px] sm:p-1 shrink-0 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Light mode (OFF)
        "bg-slate-200 border border-slate-300/50 shadow-inner",
        // Dark mode (OFF)
        "dark:bg-[#111111] dark:border-white/10 dark:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]",
        
        disabled && "opacity-50 cursor-not-allowed",
        
        checked 
          ? [
              // Light mode (ON)
              "bg-primary border-primary", 
              // Dark mode (ON)
              "dark:bg-[#050505] dark:border-primary dark:ring-1 dark:ring-primary/50"
            ] 
          : "justify-start"
      )}
    >
      <motion.div
        initial={false}
        animate={{
          x: checked ? "100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 700, damping: 40, mass: 0.8 }}
        className={cn(
          "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center relative overflow-hidden shrink-0",
          // Light mode (Thumb OFF)
          "bg-white border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
          // Dark mode (Thumb OFF)
          "dark:bg-gradient-to-b dark:from-[#2a2a2a] dark:to-[#111111] dark:border-white/5 dark:shadow-[0_2px_8px_rgba(0,0,0,0.8)]",
          
          checked 
            ? [
                // Light mode (Thumb ON)
                "bg-white border-white",
                // Dark mode (Thumb ON)
                "dark:from-[#1a1a1a] dark:to-[#050505]"
              ] 
            : ""
        )}
      >
        {/* Shiny metallic ring effect inside thumb (Dark mode only) */}
        <div className="hidden dark:block absolute inset-0 rounded-full border-[1px] border-transparent bg-gradient-to-br from-white/20 via-transparent to-white/5 [mask-image:linear-gradient(white,white)] [mask-composite:exclude] -z-10"></div>
        <div className="hidden dark:block absolute inset-0 rounded-full ring-1 ring-inset ring-white/5"></div>
        
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.05 }}
          >
            <Check 
              className={cn(
                "w-3 h-3 sm:w-3.5 sm:h-3.5",
                // Light mode: checkmark is primary color
                "text-primary",
                // Dark mode: checkmark can also be primary color
                "dark:text-primary"
              )} 
              strokeWidth={3} 
            />
          </motion.div>
        )}
      </motion.div>
    </button>
  )
}
