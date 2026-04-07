import forms from '@tailwindcss/forms'
import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f8597eff',
        secondary: '#f7a083',
        surface: '#f7f8fa',
        ink: '#23262d',
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Libre Baskerville', 'serif'],
      },
      boxShadow: {
        soft: '0 12px 35px -18px rgba(248, 63, 107, 0.55)',
      },
    },
  },
  plugins: [forms, flowbitePlugin],
}
