/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F61',
        secondary: '#FFD700',
        accent: '#FF1493',
        neutral: '#F5F5F5',
        dark: '#333333',
        vibrantGreen: '#4CAF50',
        vibrantBlue: '#00BFFF',
        vibrantPurple: '#8A2BE2',
      },
      fontFamily: {
        cabinSketch: ['Cabin Sketch', 'cursive'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        vibrant: '0 4px 6px rgba(0, 0, 0, 0.1)',
        intense: '0 6px 10px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        xl: '1rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
