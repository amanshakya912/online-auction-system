import { motion } from 'framer-motion';
import { transitions } from '../../constants/designTokens';

const PageTransition = ({ children, className = '' }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const variants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0 : parseFloat(transitions.slow) / 1000,
        ease: [0.0, 0, 0.2, 1], // ease-out for entrance
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
