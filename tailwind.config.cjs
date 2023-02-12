/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [    
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      palette: {
          100: "#16DB65",
          200: "#058C42",
          300: "#04471C",
          400: "#0D2818",
          500: "#020202",
      },
    },
    extend: {
      boxShadow: {
        'neomorphism': "-20px 20px 60px #13ba56, 20px -20px 60px #19fc74"
      },
      textShadow: {
        DEFAULT: '0px 4px 4px #00000040;',
      },
      backgroundImage: {
        'gradient-r' : 'radial-gradient(circle, rgba(80,213,183,1) 0%, rgba(6,125,104,1) 100%)',
        'gradient-test' : 'linear-gradient(to right, #093637, #44A08D)'
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
    fontFamily: {
      'gotham': ['Gotham', 'sans-serif']
    },
  },

  plugins: [
    require('flowbite/plugin'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
  })],
  
}
