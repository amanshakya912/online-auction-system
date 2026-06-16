import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const Input = ({
  label,
  type = 'text',
  error = '',
  helperText = '',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  required = false,
  value,
  onChange,
  onBlur,
  className = '',
  showValidation = false,
  isValid = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const hasValue = value && value.length > 0;
  const isLabelFloating = isFocused || hasValue;
  const showError = error && hasInteracted;
  const showSuccess = showValidation && isValid && hasValue && !error;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasInteracted(true);
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input container */}
      <div className="relative">
        {/* Icon (left) */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input field */}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-full px-4 py-3 
            bg-background-elevated
            border-2 rounded-md
            text-text-primary
            transition-all duration-200
            focus:outline-none
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${showValidation ? 'pr-10' : ''}
            ${showError ? 'border-semantic-error focus:border-semantic-error focus:ring-2 focus:ring-semantic-error/20' : ''}
            ${isFocused && !showError ? 'border-primary focus:ring-2 focus:ring-primary/20 shadow-glow' : 'border-border-default'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />

        {/* Floating label */}
        <motion.label
          animate={{
            top: isLabelFloating ? '0' : '50%',
            translateY: isLabelFloating ? '-50%' : '-50%',
            scale: isLabelFloating ? 0.85 : 1,
            left: icon && iconPosition === 'left' && !isLabelFloating ? '2.5rem' : '1rem',
          }}
          transition={{ duration: 0.2, ease: [0.0, 0, 0.2, 1] }}
          className={`
            absolute left-4 
            px-1 bg-background-elevated
            pointer-events-none
            origin-left
            ${isFocused ? 'text-primary' : 'text-text-secondary'}
            ${showError ? 'text-semantic-error' : ''}
          `}
        >
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </motion.label>

        {/* Validation icon (right) */}
        {showValidation && (hasValue || hasInteracted) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {showSuccess && (
                <motion.div
                  key="success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-semantic-success"
                >
                  <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                </motion.div>
              )}
              {showError && (
                <motion.div
                  key="error"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-semantic-error"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Icon (right) */}
        {icon && iconPosition === 'right' && !showValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-semantic-error flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      {helperText && !showError && (
        <div className="mt-1 text-sm text-text-secondary">
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
