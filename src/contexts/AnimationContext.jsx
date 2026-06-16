import { createContext, useContext, useState, useEffect } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const animationConfig = {
    reducedMotion,
    pageTransition: {
      duration: reducedMotion ? 0 : 300,
      easing: 'cubic-bezier(0.0, 0, 0.2, 1)',
    },
    microInteraction: {
      duration: reducedMotion ? 0 : 150,
      easing: 'cubic-bezier(0.0, 0, 0.2, 1)',
    },
    loading: {
      duration: reducedMotion ? 0 : 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  return (
    <AnimationContext.Provider value={animationConfig}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationContext;
