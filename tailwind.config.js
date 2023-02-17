/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*/*.{html,js}", "./*/*/*.{html,js}", "./*.{html,js}"],
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
