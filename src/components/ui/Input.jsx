import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, error, leftIcon: LeftIcon, type, variant = 'default', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="relative w-full group">
      {LeftIcon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <LeftIcon className="h-5 w-5" />
        </div>
      )}
      
      <input
        ref={ref}
        type={inputType}
        className={cn(
          variant === 'auth' ? 'input-dark' : 'glass-input w-full py-3.5 text-sm font-medium tracking-wide transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50 placeholder:text-muted-foreground',
          LeftIcon && 'pl-12',
          isPassword && 'pr-12',
          error && 'border-destructive focus-visible:ring-destructive focus:border-destructive focus:ring-destructive/50',
          className
        )}
        {...props}
      />
      
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-[50%] -translate-y-[50%] h-8 w-8 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-destructive font-medium pl-1">{error}</p>
      )}
    </div>
  )
});

Input.displayName = 'Input';
