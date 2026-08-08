import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  isLoading, 
  children, 
  ...props 
}, ref) => {
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

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      ref={ref}
      disabled={isLoading || props.disabled}
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
