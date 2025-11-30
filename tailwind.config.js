/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // LeanData Brand Colors
        'lean': {
          'green': '#26D07C',      // LEAN GREEN - Primary brand color
          'action': '#01EB1D',      // ACTION GREEN - Supporting color
          'black': '#2A2A2A',       // ALMOST BLACK - Primary text
          'white': '#FFFFFF',       // WHITE
          'almost-white': '#F7F7F7', // ALMOST WHITE - Supporting color
          // Opacity variants for text
          'black-80': 'rgba(42, 42, 42, 0.8)',
          'black-70': 'rgba(42, 42, 42, 0.7)',
          'black-60': 'rgba(42, 42, 42, 0.6)',
          // Background variants
          'green-10': 'rgba(38, 208, 124, 0.1)',
        },
      },
    },
  },
  plugins: [],
}
