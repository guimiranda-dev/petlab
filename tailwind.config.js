import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: '#ffffff',
            foreground: '#0f172a',
            primary: {
              50: '#f0fbfc',
              100: '#d9f2f5',
              200: '#b8e7ec',
              300: '#87d6de',
              400: '#6eaeb7',
              500: '#4f9ca8',
              600: '#44808d',
              700: '#3d6973',
              800: '#39575f',
              900: '#324a51',
              DEFAULT: '#6eaeb7',
              foreground: '#ffffff',
            },
            secondary: {
              50: '#fffbeb',
              100: '#fef3c7',
              200: '#fde68a',
              300: '#fcd34d',
              400: '#f9a151',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
              900: '#78350f',
              DEFAULT: '#f9a151',
              foreground: '#ffffff',
            },
            focus: '#6eaeb7',
          },
        },
      },
    }),
  ],
};

module.exports = config;
