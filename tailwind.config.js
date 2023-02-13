/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    extend: {
      maxHeight: {
        '550px': '550px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
