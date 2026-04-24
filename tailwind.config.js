/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff9ed',
          100: '#fef0d3',
          200: '#fddea5',
          300: '#fcc66d',
          400: '#faa432',
          500: '#f8860a',
          600: '#e96a05',
          700: '#c24f08',
          800: '#9a3e0e',
          900: '#7c340f',
        },
        earth: {
          50: '#fdf6ef',
          100: '#f9e9d5',
          200: '#f2d0ab',
          300: '#e9b175',
          400: '#de8d47',
          500: '#d6722a',
          600: '#c85b1f',
          700: '#a6461c',
          800: '#85391c',
          900: '#6c301a',
        },
        herbal: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        vata: '#8b5cf6',
        pitta: '#f97316',
        kapha: '#06b6d4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
