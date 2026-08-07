import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative w-[76px] h-11 rounded-[22px] flex items-center p-[4px] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "bg-[#0f0f0f] border border-white/20 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.1)]",
        disabled && "opacity-50 cursor-not-allowed",
        checked ? "bg-black border-primary/40 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9),0_0_12px_rgba(14,165,233,0.25)]" : ""
      )}
    >
      <motion.div
        initial={false}
        animate={{
          x: checked ? 35 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "w-[34px] h-[34px] rounded-full flex items-center justify-center relative overflow-hidden",
          "bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]",
          "shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)]",
          checked ? "from-[#202020] to-[#0f0f0f]" : ""
        )}
      >
        {/* Shiny metallic ring effect to mimic the image */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent bg-gradient-to-br from-white/40 via-transparent to-white/10 [mask-image:linear-gradient(white,white)] [mask-composite:exclude] -z-10"></div>
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"></div>
        
        {checked ? (
          <Check className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" strokeWidth={2.5} />
        ) : (
          <ArrowRight className="w-4 h-4 text-[#666666]" strokeWidth={2.5} />
        )}
      </motion.div>
    </button>
  )
}
