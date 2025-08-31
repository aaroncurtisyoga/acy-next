const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        md: "768px",
        lg: "1024px",
        "2xl": "1536px",
      },
      maxWidth: {
        "screen-2xl": "1536px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
