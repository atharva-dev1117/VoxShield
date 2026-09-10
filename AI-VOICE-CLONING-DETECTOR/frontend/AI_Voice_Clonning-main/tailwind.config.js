/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#F7F8FA',
          100: '#EEF1F5',
          200: '#DCE2E9',
          300: '#B8C2CE',
          400: '#8B97A5',
          500: '#5F6B78',
          600: '#424C58',
          700: '#2E363F',
          800: '#1C2228',
          900: '#11161B',
          950: '#080B10',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FAFBFC',
          sunken: '#F4F6F8',
          border: '#E4E8EC',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        teal: {
          50: '#ECFEFB',
          100: '#CFFAEF',
          200: '#9EF4DF',
          300: '#5BE9C9',
          400: '#2FE6C4',
          500: '#14C9A8',
          600: '#0BA88A',
          700: '#0A826D',
          800: '#0B6455',
          900: '#0A4F44',
        },
        risk: {
          low: '#2FE6C4',
          medium: '#F5B93D',
          high: '#FF5470',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)',
        'card-lg': '0 4px 6px -1px rgba(16, 24, 40, 0.05), 0 10px 20px -2px rgba(16, 24, 40, 0.08)',
        'card-xl': '0 12px 24px -4px rgba(16, 24, 40, 0.08), 0 24px 48px -8px rgba(16, 24, 40, 0.12)',
        glow: '0 0 0 4px rgba(99, 102, 241, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
        'scan-sweep': 'scanSweep 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        scanSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
