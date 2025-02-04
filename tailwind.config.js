/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          300: '#D1D5DB',
        },
        indigo: {
          400: '#818CF8',
          300: '#A5B4FC',
        },
      },
    },
  },
  plugins: [],
};