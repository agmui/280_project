/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    namedGroups: ["btn3b"],
    extend: {
      zIndex: {
        '-1': '-1',
      },
      maxHeight: {
        '550px': '550px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  variants: {
    extend: {
      rotate: ['group-hover'],
      scale: ['group-hover']
    }
  },
}
