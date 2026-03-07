/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light: '#e0f2fe',
          hover: '#0284c7'
        },
        sell: '#B71C1C',
        hold: '#E65100',
        partial: '#0D47A1'
      },
      fontFamily: {
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
