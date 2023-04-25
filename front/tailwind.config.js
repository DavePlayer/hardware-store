/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aside: {default: "#060a30", button: "#0050d3"},
        button: {
          enabled: ['#d6f5ed', '#2eb594'],
          disabled: ['#f4f4f4', "#d6d6d6"],
        }
      },
    },
  },
  plugins: [],
}

