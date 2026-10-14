/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff5f7',
          100: '#ffe4ea',
          200: '#fecdd7',
          300: '#fda4b8',
          400: '#fb7193',
          500: '#f43f6e',
          600: '#e11d54',
          700: '#be1242',
          800: '#9d123b',
          900: '#831435',
          950: '#480619',
        },
        dark: {
          900: '#0f0f11',
          850: '#141417',
          800: '#1a1a1e',
          700: '#27272c',
        },
        paypal: {
          blue: '#003087',
          gold: '#ffc439',
          dark: '#001c64',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
