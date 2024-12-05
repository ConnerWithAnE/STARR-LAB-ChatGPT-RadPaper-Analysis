import type { Config } from 'tailwindcss'
import { nextui } from "@nextui-org/react";

export default {
  content: [
    './public/index.html',
    './src/pages/**/*.{html,js,tsx,ts}',
    './src/components/**/*.{html,js,tsx,ts}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
} satisfies Config

