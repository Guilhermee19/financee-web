/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#55b02e',
        secondary: '#141414',
        tertiary: '#0f0e11',
        label: '#fff',
        grey: '#222124',
      },
    },
  },
  plugins: [],
}
