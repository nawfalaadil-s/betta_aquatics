/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#06101E',
          900: '#0B1D3A',
          850: '#0F274E',
          800: '#15366C',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        aqua: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        coral: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        brand: {
          primary: 'var(--brand-primary, #1e3a8a)',
          'primary-hover': 'var(--brand-primary-hover, #172554)',
          'primary-light': 'var(--brand-primary-light, #eff6ff)',
          'primary-text': 'var(--brand-primary-text, #ffffff)',
          secondary: 'var(--brand-secondary, #dc2626)',
          'secondary-hover': 'var(--brand-secondary-hover, #b91c1c)',
          'secondary-light': 'var(--brand-secondary-light, #fef2f2)',
          'secondary-text': 'var(--brand-secondary-text, #ffffff)',
          accent: 'var(--brand-accent, #0284c7)',
          'accent-text': 'var(--brand-accent-text, #ffffff)',
          bg: 'var(--brand-bg, #f8fafc)',
          text: 'var(--brand-text, #0f172a)',
          blue: '#1D4ED8',
          'blue-dark': '#0F274E',
          'blue-light': '#EFF6FF',
          red: '#DC2626',
          'red-dark': '#B91C1C',
          'red-light': '#FEF2F2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.35)',
        'glow-red': '0 0 20px -3px rgba(220, 38, 38, 0.35)',
        'card-hover': '0 12px 30px -10px rgba(11, 29, 58, 0.12)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '2xs': '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
