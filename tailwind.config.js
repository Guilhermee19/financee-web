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
        grey: 'rgba(255, 255, 255, .2)',
      },
    },
  },
  plugins: [],
}
