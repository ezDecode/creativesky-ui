import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'muted-2': 'var(--muted-2)',
        'muted-3': 'var(--muted-3)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Consolas', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
