/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Correctly configure font families for Tailwind to use
      fontFamily: {
        'amdfonts': ['AMDFonts', ...defaultTheme.fontFamily.sans],
        'polysans': ['PolySans', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}