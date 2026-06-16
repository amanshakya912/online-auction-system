/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'primary': ['Lora', 'serif'],
        'secondary': ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#A27B5C',
          dark: '#8D6547',
          light: '#C4A484',
        },
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
        status: {
          live: '#10b981',
          upcoming: '#3b82f6',
          ended: '#666666',
        },
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'raised': '0 4px 6px rgba(0, 0, 0, 0.4)',
        'modal': '0 10px 25px rgba(0, 0, 0, 0.5)',
        'popover': '0 20px 40px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 20px rgba(162, 123, 92, 0.3)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [],
}