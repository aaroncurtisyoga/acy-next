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
      animation: {
        in: "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in-from-top-1": "slideInFromTop 0.2s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInFromTop: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        gray: {
          750: "#374151",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#e8f0fe",
              100: "#c5dafc",
              200: "#9ec2fa",
              300: "#76aaf8",
              400: "#4f92f6",
              500: "#2879f4",
              DEFAULT: "#0842a0", // Google-inspired deep blue
              600: "#073789",
              700: "#062c72",
              800: "#05215b",
              900: "#041644",
              foreground: "#d3e3fd", // Soft blue-white for text
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#e8f0fe",
              100: "#c5dafc",
              200: "#9ec2fa",
              300: "#76aaf8",
              400: "#4f92f6",
              500: "#2879f4",
              DEFAULT: "#0842a0", // Google-inspired deep blue
              600: "#073789",
              700: "#062c72",
              800: "#05215b",
              900: "#041644",
              foreground: "#d3e3fd", // Soft blue-white for text
            },
          },
        },
      },
    }),
  ],
};
