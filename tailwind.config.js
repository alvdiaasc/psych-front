/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF8A80',
          DEFAULT: '#FF5252',
          dark: '#FF1744',
        },
        secondary: {
          light: '#FFE57F',
          DEFAULT: '#FFD740',
          dark: '#FFC400',
        },
        accent: {
          light: '#B388FF',
          DEFAULT: '#7C4DFF',
          dark: '#651FFF',
        },
        success: {
          light: '#69F0AE',
          DEFAULT: '#00E676',
          dark: '#00C853',
        },
        background: {
          light: '#F8F9FA',
          DEFAULT: '#F1F3F5',
          dark: '#E9ECEF',
        }
      },
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        display: ['Cabin Sketch', 'cursive'],
        game: ['Fredoka One', 'cursive'],
      },
      boxShadow: {
        'game': '0 4px 0 0 rgba(0, 0, 0, 0.2)',
        'game-hover': '0 6px 0 0 rgba(0, 0, 0, 0.2)',
        'card': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'bounce-soft': 'bounce-soft 1s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1' }],
        'display': ['3rem', { lineHeight: '1.2' }],
        'display-sm': ['2.5rem', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [],
};
