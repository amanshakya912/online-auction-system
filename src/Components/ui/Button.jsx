import { useState } from 'react';
import { motion } from 'framer-motion';
import { transitions } from '../../constants/designTokens';

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-background-elevated hover:bg-gray-700 text-text-primary border border-border-default',
    outline: 'bg-transparent hover:bg-background-elevated text-primary border-2 border-primary hover:border-primary-dark',
    ghost: 'bg-transparent hover:bg-background-elevated text-text-primary',
    danger: 'bg-semantic-error hover:bg-red-600 text-white',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Icon size mapping
  const iconSizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    // Call onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: parseFloat(transitions.fast) / 1000 }}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center gap-2
        font-medium rounded-md
        transition-all duration-${transitions.fast}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-primary
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <svg
          className={`animate-spin ${iconSizeMap[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon (left) */}
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconSizeMap[size]}>{icon}</span>
      )}

      {/* Button text */}
      {children}

      {/* Icon (right) */}
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconSizeMap[size]}>{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;
