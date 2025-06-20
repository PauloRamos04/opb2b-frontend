// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ajuste de acordo com seu projeto
  ],
  safelist: [
    {
      pattern: /bg-(red|orange|yellow|green|teal|blue|indigo|purple|pink|emerald|gray|slate|cyan|amber|violet|sky|lime|rose|fuchsia|stone)-(400|500|600|700)/,
    },
    {
      pattern: /text-(white|gray-900)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
