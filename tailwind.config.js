/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        secondary: '#2563EB',
        light: '#F3F4F6'
      }
    },
  },
  plugins: [],
};