/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      backgroundSize: {
        '100%': '100%',
      },
      colors: {
        redLight: '#EB5858',
        blue20: '#3840FF',
        blueDeep: '#514DF5',
        gray10: 'rgba(0,0,0,.1)',
        gray30: '#d9d9d9',
      },
      boxShadow: {
        box: '0px 13px 18px rgba(0, 0, 0, 0.08)',
        table: '0px 6px 18px rgba(0, 0, 0, 0.08)',
      },
    },
  },

};
