/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: '#FF9900',
          dark: '#E47911',
          light: '#FFB84D',
          blue: '#232F3E',
          'blue-light': '#37475A',
          'blue-dark': '#131921',
          teal: '#00A8E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateY(-10px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};
