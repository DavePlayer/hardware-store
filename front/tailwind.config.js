/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aside: {default: "#060a30", button: "#0050d3"},
      }
    },
  },
  plugins: [],
}

