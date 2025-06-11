/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub inspired color palette with better semantic naming
        github: {
          bg: {
            primary: '#0d1117', // Dark primary background
            secondary: '#161b22', // Dark secondary background
            tertiary: '#21262d', // Dark tertiary background
            canvas: '#ffffff', // Light primary background
            'canvas-inset': '#f6f8fa', // Light secondary background
            'canvas-subtle': '#f6f8fa', // Light tertiary background
          },
          border: {
            default: '#30363d', // Dark borders
            muted: '#21262d', // Dark muted borders
            light: '#d0d7de', // Light borders
            'light-muted': '#e1e4e8', // Light muted borders
          },
          text: {
            primary: '#e6edf3', // Dark mode primary text
            secondary: '#7d8590', // Dark mode secondary text
            muted: '#656c76', // Dark mode muted text
            light: '#24292f', // Light mode primary text
            'light-secondary': '#656d76', // Light mode secondary text
            'light-muted': '#8b949e', // Light mode muted text
            inverse: '#ffffff', // White text for dark backgrounds
          },
          accent: {
            primary: '#2f81f7', // Primary accent (blue)
            'primary-hover': '#1f6feb', // Primary accent hover
            success: '#238636', // Success color (green)
            'success-hover': '#1a7f37', // Success hover
            warning: '#d1242f', // Warning/danger color (red)
            'warning-hover': '#cf222e', // Warning hover
            info: '#0969da', // Info color
            'info-hover': '#0550ae', // Info hover
          },
          surface: {
            'light-elevated': '#ffffff', // Light elevated surfaces
            'light-sunken': '#f6f8fa', // Light sunken surfaces
            'dark-elevated': '#21262d', // Dark elevated surfaces
            'dark-sunken': '#161b22', // Dark sunken surfaces
          },
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Noto Sans',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SFMono-Regular',
          'Consolas',
          'Liberation Mono',
          'Menlo',
          'monospace',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
