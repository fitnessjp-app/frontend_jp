/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e17',
          900: '#0f1522',
          800: '#161d2e',
          700: '#1f2940',
        },
        accent: {
          DEFAULT: '#ff7a1a',
          light: '#ff9950',
          dark: '#e6650a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pop: { '0%': { opacity: 0, transform: 'scale(0.6)' }, '70%': { transform: 'scale(1.08)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        ring: { '0%': { transform: 'scale(0.8)', opacity: 0.6 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
        bar: { '0%': { width: '0%' }, '100%': { width: '100%' } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(40px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-up': 'fadeUp .5s ease-out both',
        'fade-in': 'fadeIn .4s ease-out both',
        pop: 'pop .6s cubic-bezier(.2,.8,.2,1) both',
        ring: 'ring 1.8s ease-out infinite',
        bar: 'bar 2.4s ease-in-out both',
        'slide-up': 'slideUp .25s ease-out both',
      },
    },
  },
  plugins: [],
};
