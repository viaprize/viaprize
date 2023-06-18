/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundSize:{
        '100%': '100%'
      },
      colors: {
          redLight: "#EB5858",
          blue: "#3840FF",
          blueDeep: "#514DF5",
          gray10: "rgba(0,0,0,.1)",
          gray30: "#d9d9d9",
      },
      boxShadow:{
        'box': '0px 13px 18px rgba(0, 0, 0, 0.08)',
        'table': '0px 6px 18px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [require('daisyui')],
}
