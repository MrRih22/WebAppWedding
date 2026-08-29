/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: { 50: '#F4F6F4', 100: '#E9ECE8', 500: '#879A83', 900: '#2C362A' },
        gold: { 400: '#E5C158', 500: '#D4AF37', 600: '#B5952F' },
        pastel: '#FDFBF7'
      }
    },
  },
  plugins: [],
}