/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#009688',
          light: '#4DB6AC',
          dark: '#00796B',
        },
        secondary: {
          DEFAULT: '#000000',
          light: '#212121',
          dark: '#000000',
        },
        background: {
          DEFAULT: '#1a1a1a',
          light: '#242424',
          dark: '#121212',
          card: '#1e1e1e',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        warning: {
          DEFAULT: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
        },
        error: {
          DEFAULT: '#F44336',
          light: '#E57373',
          dark: '#D32F2F',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      },
    },
  },
  plugins: [],
};