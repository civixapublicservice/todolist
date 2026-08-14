import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function CustomSelect({ value, onChange, options, icon: Icon, ariaLabel, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between px-3 sm:px-4 py-2.5 text-sm font-medium rounded-[1.25rem] transition-all duration-300",
          "bg-foreground/5 dark:bg-[#121212]/50 border border-black/5 dark:border-white/5",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
          isOpen && "ring-2 ring-primary/20 border-primary/50 bg-background"
        )}
      >
        <div className="flex items-center space-x-2.5">
          {Icon && <Icon strokeWidth={2.5} className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary" : "text-foreground/70")} />}
          <span className="text-foreground truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-foreground/50 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-2 w-full min-w-[180px] bg-background/95 dark:bg-[#151515]/95 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden py-1",
              align === 'right' ? 'right-0' : 'left-0'
            )}
            role="listbox"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                role="option"
                aria-selected={value === option.value}
                className={cn(
                  "w-full flex items-center justify-between px-3 sm:px-4 py-2.5 text-sm text-left transition-colors",
                  value === option.value 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground font-medium"
                )}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={3} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
