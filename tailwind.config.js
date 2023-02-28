/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    screens: {
      'mobile': '640px',
      'tablet': '768px',
      'laptop': '1440px',
      'desktop': '1600px'
    },
    extend: {
      backgroundColor: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",
        alt: "var(--bg-color)"
      },
      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)"
      },
      fontFamily: {
        sans: ['var(--font-leagueSpartan)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
