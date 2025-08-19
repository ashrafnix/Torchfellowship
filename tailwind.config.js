/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0A0A0A',
        'brand-surface': '#141417',
        'brand-muted': '#2B2F36',
        'brand-gold': {
          DEFAULT: '#E0B841',
          dark: '#C8A33A'
        },
        'brand-text': {
          DEFAULT: '#EAEAEA',
          dark: '#A0A0A0'
        },
        'brand-light': '#F0EAD6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        aurora: 'aurora 60s linear infinite',
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    }
  },
  plugins: [],
}

