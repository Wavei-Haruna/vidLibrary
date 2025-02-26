/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Ubuntu Mono'],
        header: ['Roboto'],
      },
      colors: {
        primary: '#003366', // Deep blue
        secondary: '#0066cc', // Lighter blue
        accent: '#ff6600', // Vibrant orange
        btn: '#004d99', // Strong contrasting color
      },
    },
  },
  plugins: [],
}
