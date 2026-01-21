/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1a237e',
        secondary: '#283593',
        tertiary: '#e53935',
        accent: {
          1: '#ffd600',
          2: '#FFD700',
        },
        surface: {
          DEFAULT: '#283593',
          variant: '#616161',
        },
        fortune: {
          daikichi: '#FFD700',
          chukichi: '#ffd600',
          shokichi: '#FF9800',
          kichi: '#4CAF50',
          suekichi: '#2196F3',
          kyo: '#9E9E9E',
        },
        textMuted: '#9E9E9E',
      },
    },
  },
  plugins: [],
}

