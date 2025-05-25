/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#195764',
        'primary-dark': '#124450',
        dark: {
          DEFAULT: '#1a1a1a',
          lighter: '#1f2937',
          lightest: '#d1d5db',
        }
      },
    },
  },
  plugins: [],
}
