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
        DarkGreen: '#161716',
        Red: '#e93030',
        DarkGray: '#1f1f21',
        label: '#fff',
        Gray: '#71717a',
        LightGray: '#B8B8B8',
        White: '#fff',
      },
    },
  },
  plugins: [],
}
