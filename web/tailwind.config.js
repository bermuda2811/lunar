/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B3261E',
          dark: '#8B1D1D',
          light: '#FFEBEE',
          surface: '#FFF5F5'
        },
        heritage: {
          green: '#0F5132',
          'green-light': '#E8F5E9',
          'green-border': '#C8E6C9',
          red: '#B3261E',
          'red-light': '#FFEBEE',
          'red-border': '#FFCDD2',
          gold: '#C59B27',
          warm: '#FFFBF5',
          cream: '#FDF8F0'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Noto Serif', 'Merriweather', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
