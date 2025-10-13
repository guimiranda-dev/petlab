// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@heroui/theme/dist/components/(autocomplete|button|card|code|divider|drawer|dropdown|input|input-otp|kbd|link|listbox|navbar|pagination|select|snippet|spinner|toggle|table|toast|popover|ripple|form|scroll-shadow|modal|menu|checkbox|spacer).js',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
};
