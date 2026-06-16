import { motion } from 'framer-motion';
import { shadows, borderRadius, transitions } from '../../constants/designTokens';

const Card = ({
  elevation = 'card',
  padding = 'md',
  hoverable = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  // Elevation styles
  const elevationStyles = {
    card: 'shadow-card',
    raised: 'shadow-raised',
    modal: 'shadow-modal',
  };

  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const isInteractive = hoverable || onClick;

  return (
    <motion.div
      onClick={onClick}
      whileHover={isInteractive ? { y: -4, scale: 1.02 } : {}}
      transition={{
        duration: parseFloat(transitions.normal) / 1000,
        ease: [0.0, 0, 0.2, 1],
      }}
      className={`
        bg-background-elevated
        rounded-lg
        ${elevationStyles[elevation]}
        ${paddingStyles[padding]}
        ${isInteractive ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        borderRadius: borderRadius.lg,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
