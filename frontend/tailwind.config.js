/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        dark: {
          DEFAULT: '#0f0f0f',
          100: '#1a1a1a',
          200: '#252525',
          300: '#333333',
          400: '#444444',
        }
      },
    },
  },
  plugins: [],
}
