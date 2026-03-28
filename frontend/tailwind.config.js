/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rahula: {
          blue: "#0A2E73",
          gold: "#D4AF37",
          dark: "#0F172A",
        }
      }
    },
  },
  plugins: [],
}