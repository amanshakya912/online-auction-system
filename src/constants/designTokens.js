// Design Tokens - Foundation for the UI Design System

export const colors = {
  primary: '#A27B5C',
  primaryDark: '#8D6547',
  primaryLight: '#C4A484',
  
  background: {
    primary: '#000000',
    secondary: '#1a1a1a',
    elevated: '#212121',
  },
  
  text: {
    primary: '#e0e0e0',
    secondary: '#b0b0b0',
    disabled: '#666666',
  },
  
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    focus: '#A27B5C',
    error: '#ef4444',
  },
  
  status: {
    live: '#10b981',
    upcoming: '#3b82f6',
    ended: '#666666',
  }
};

export const typography = {
  fontFamily: {
    primary: 'Lora, serif',
    secondary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
};

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};

export const shadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.3)',
  raised: '0 4px 6px rgba(0, 0, 0, 0.4)',
  modal: '0 10px 25px rgba(0, 0, 0, 0.5)',
  popover: '0 20px 40px rgba(0, 0, 0, 0.6)',
  glow: '0 0 20px rgba(162, 123, 92, 0.3)',
};

export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  
  easing: {
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Icon sizes
export const iconSizes = {
  sm: '14px',
  md: '18px',
  lg: '24px',
  xl: '32px',
};

// Touch target minimum size for mobile
export const touchTarget = {
  minSize: '44px',
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  iconSizes,
  touchTarget,
};
