/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Paleta principal vibrante y cartoon-friendly
        primary: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800', // Color principal naranja vibrante
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
          DEFAULT: '#FF9800',
        },
        secondary: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#9C27B0', // Púrpura vibrante
          600: '#8E24AA',
          700: '#7B1FA2',
          800: '#6A1B9A',
          900: '#4A148C',
          DEFAULT: '#9C27B0',
        },
        accent: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50', // Verde fresco
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
          DEFAULT: '#4CAF50',
        },
        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107', // Amarillo brillante
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
          DEFAULT: '#FFC107',
        },
        danger: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336', // Rojo vibrante
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
          DEFAULT: '#F44336',
        },
        success: {
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#009688', // Turquesa
          600: '#00897B',
          700: '#00796B',
          800: '#00695C',
          900: '#004D40',
          DEFAULT: '#009688',
        },
        // Tonos neutros cálidos
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          DEFAULT: '#78716C',
        },
        // Fondos gradiente
        gradient: {
          start: '#FF9800',
          middle: '#9C27B0',
          end: '#4CAF50',
        }
      },
      fontFamily: {
        // Fuentes cartoon-friendly
        sans: ['Nunito', 'Inter', ...defaultTheme.fontFamily.sans],
        display: ['Fredoka One', 'Comic Neue', 'cursive'],
        game: ['Quicksand', 'Nunito', 'sans-serif'],
        fun: ['Bungee', 'Fredoka One', 'cursive'],
      },
      fontSize: {
        'display-mega': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-xl': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'display-xs': ['2rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        // Sombras tipo cartoon
        'game': '0 8px 0 0 rgba(0, 0, 0, 0.2)',
        'game-hover': '0 12px 0 0 rgba(0, 0, 0, 0.2)',
        'game-active': '0 4px 0 0 rgba(0, 0, 0, 0.2)',
        'card': '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 24px 48px -12px rgba(0, 0, 0, 0.15)',
        'floating': '0 32px 64px -12px rgba(0, 0, 0, 0.25)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
        'neon': '0 0 20px rgba(156, 39, 176, 0.4)',
        'neon-strong': '0 0 40px rgba(156, 39, 176, 0.6)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        'full': '9999px',
      },
      animation: {
        // Animaciones cartoon
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'party-gradient': 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #4CAF50 100%)',
        'fun-gradient': 'linear-gradient(45deg, #FFC107 0%, #FF9800 25%, #9C27B0 50%, #4CAF50 75%, #009688 100%)',
      },
    },
  },
  plugins: [],
};
