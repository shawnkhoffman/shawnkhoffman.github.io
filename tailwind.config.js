/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'rotate-clockwise': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'rotate-counterclockwise': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        'rotate-sun': 'rotate-clockwise 0.15s ease-in-out forwards',
        'rotate-moon': 'rotate-counterclockwise 0.1s ease-in-out forwards',
        spinSlow: 'spin 20s linear infinite',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
  },
}