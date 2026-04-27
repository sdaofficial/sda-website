/**
 * Single source of truth for colors and fonts.
 * Legacy CSS uses `theme('colors.primary.600')` and `@apply font-sans` — no :root variables.
 * In JSX use utilities: `text-primary-400`, `bg-gray-50`, `font-sans`, etc.
 */

const fontSans = [
  'Satoshi-Variable',
  'Satoshi-Regular',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'sans-serif',
];

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#db5026',
          900: '#160e0e',
          600: '#c54822',
          500: '#db5026',
          '500-alpha': '#db50261a',
          400: '#f1582a',
          '400-alpha': '#f1582a1a',
          300: '#e27250',
          '300-alpha': '#e272501a',
        },
        gray: {
          900: '#0a0101',
          800: '#131313',
          '800-alpha': '#1313131a',
          700: '#1a1a1a',
          600: '#333333',
          500: '#888888',
          400: '#adadad',
          300: '#c3c3c3',
          '300-alpha': '#c3c3c31a',
          200: '#cbcbcb',
          100: '#eeeeee',
          50: '#F9F9F9',
        },
        brown: {
          1: '#0a0101',
          2: '#c3c3c3',
          alpha: '#c3c3c31a',
        },
        black: '#0A0101',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: fontSans,
        display: fontSans,
      },
    },
  },
  plugins: [],
};

export default config;
