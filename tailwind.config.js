/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5a53f7',
          50: '#f0f0ff',
          100: '#e4e2ff',
          200: '#ccc9ff',
          300: '#a8a1ff',
          400: '#7d71ff',
          500: '#5a53f7',
          600: '#4b3eec',
          700: '#4032d8',
          800: '#342bb0',
          900: '#2e298a',
        },
        accent: '#00fa97',
      },
    },
  },
  plugins: [],
}