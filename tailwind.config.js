/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontSize: {
        base: 'calc(12px + 0.3125vw)',
      },
      borderRadius: {
        default: '12px',
      },
      colors: {
        primary: '#55b02e',
        primary8: 'rgba(85,176,46,.08)',
        secondary: '#141414',
        tertiary: '#0f0e11',
        DarkGreen: '#161716',
        Red: '#e93030',
        Red8: 'rgba(246,53,46,.08)',
        DarkGray: '#1f1f21',
        label: '#fff',
        Gray: '#71717a',
        LightGray: '#B8B8B8',
        White: '#fff',
        White8: 'rgba(255,255,255,.08)',
        White3: 'rgba(255,255,255,.03)',
      },
      boxShadow: {
        custom: '0 4px 26px rgba(25, 25, 25, 0.25)',
      },
      animation: {
        'spin-fast': 'spin 0.5s linear infinite',
        'pulse-notification': 'pulse-notification 1s ease-out',
        'move-left-to-right': 'move-left-to-right 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'up-down': 'up-down 1.2s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'blink-smooth': 'blink-smooth 1s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'shake': 'shake 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-in': 'fade-in 0.5s ease-in-out forwards'
      },
      keyframes: {
        'pulse-notification': {
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        'move-left-to-right': {
          '0%': { transform: 'translateX(-100%)' }
        },
        'up-down': {
          '0%': { transform: 'translateY(0px)' },
          '35%': { transform: 'translateY(-12px) rotate(0deg)' },
          '55%': { transform: 'translateY(2px) rotate(720deg)' },
          '100%': { transform: 'translateY(0px) rotate(720deg)' }
        },
        'blink-smooth': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '1' }
        },
        'shake': {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(5px)' },
          '50%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
          '100%': { transform: 'translateX(0)' }
        },
        'fade-in': {
          '100%': { opacity: '1' }
        }
      },
      scrollbar: {
        track: '#282d37', // --scroll-track
        thumb: '#757575', // --scroll-thumb
      },
    },
  },
  plugins: [],
}
