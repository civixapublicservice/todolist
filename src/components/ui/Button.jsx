import React from 'react';
import { cn } from '../../utils/cn';
import { motion, useReducedMotion } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  isLoading, 
  children, 
  onClick,
  ...props 
}, ref) => {
  const shouldReduceMotion = useReducedMotion();
  const { playUISound } = useAudio();
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    gradient: 'btn-gradient',
    icon: 'btn-icon'
  };

  const sizes = {
    default: '',
    small: 'btn-small'
  };

  const handleClick = (e) => {
    if (!isLoading && !props.disabled) {
      playUISound('click');
      if (onClick) onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={shouldReduceMotion || props.disabled ? {} : { scale: 1.01 }}
      whileTap={shouldReduceMotion || props.disabled ? {} : { scale: 0.98 }}
      ref={ref}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
      className={cn(
        'btn',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="spinner mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
