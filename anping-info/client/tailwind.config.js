/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1677ff', dark: '#0958d9', light: '#69b1ff' },
        accent: { DEFAULT: '#ff6b35', dark: '#d9480f', light: '#ff8a5b' }
      }
    }
  },
  plugins: []
}
