/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
      primary: {
        100: '#ba2f74',
        200: '#E67CB1'
      },
      secondary: {
        100: '#167199',
        200: '#28BFD2'
      }
    },
    },
  },
  plugins: [],
};
