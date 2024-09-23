// tailwind.config.ts

import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "2/1": "2/1",
      },
      backgroundImage: {},
      fontFamily: {
        sans: ["Roboto Flex", "sans-serif"], // Apply Roboto Flex to sans family
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      themes: {
        light: {
          colors: {
            background: {
              50: "#f3f4f6",
              100: "#e5e7eb",
              200: "#d1d5db",
              300: "#9ca3af",
              400: "#6b7280",
              500: "#4b5563",
              600: "#374151",
              700: "#1f2937",
              800: "#111827",
              900: "#0f172a",
              DEFAULT: "#ffffff",
              foreground: "#000000",
            },
            foreground: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
              DEFAULT: "#000000",
              foreground: "#ffffff",
            },
            primary: {
              50: "#e0e8ff",
              100: "#c0d0ff",
              200: "#a0b8ff",
              300: "#809fff",
              400: "#6087ff",
              500: "#587ee0", // your provided blue
              600: "#506ccc",
              700: "#4058aa",
              800: "#304488",
              900: "#203066",
              DEFAULT: "#587ee0",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#fff8e6",
              100: "#ffebcc",
              200: "#ffdba3",
              300: "#ffcb7a",
              400: "#ffba51",
              500: "#ffaa28",
              600: "#cc881f",
              700: "#995f17",
              800: "#66400f",
              900: "#332008",
              DEFAULT: "#ffaa28",
              foreground: "#000000",
            },
            success: {
              50: "#e5f9f0",
              100: "#bff3db",
              200: "#99edc7",
              300: "#73e7b2",
              400: "#4de19e",
              500: "#33c682",
              600: "#2ba169",
              700: "#228c50",
              800: "#1a7037",
              900: "#12551f",
              DEFAULT: "#33c682",
              foreground: "#ffffff",
            },
            warning: {
              50: "#fff4e5",
              100: "#ffe4bf",
              200: "#ffd399",
              300: "#ffc373",
              400: "#ffb34d",
              500: "#ffaa28",
              600: "#cc881f",
              700: "#995f17",
              800: "#66400f",
              900: "#332008",
              DEFAULT: "#ffaa28",
              foreground: "#000000",
            },
            danger: {
              50: "#ffe5e5",
              100: "#ffbfbf",
              200: "#ff9999",
              300: "#ff7373",
              400: "#ff4d4d",
              500: "#ff2828",
              600: "#cc2020",
              700: "#991818",
              800: "#661010",
              900: "#330808",
              DEFAULT: "#ff2828",
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            background: {
              50: "#18181b",
              100: "#27272a",
              200: "#3f3f46",
              300: "#52525b",
              400: "#71717a",
              500: "#a1a1aa",
              600: "#d4d4d8",
              700: "#e4e4e7",
              800: "#f4f4f5",
              900: "#fafafa",
              DEFAULT: "#000000",
              foreground: "#ffffff",
            },
            foreground: {
              50: "#111827",
              100: "#1f2937",
              200: "#374151",
              300: "#4b5563",
              400: "#6b7280",
              500: "#9ca3af",
              600: "#d1d5db",
              700: "#e5e7eb",
              800: "#f3f4f6",
              900: "#ffffff",
              DEFAULT: "#ffffff",
              foreground: "#000000",
            },
            primary: {
              50: "#202a4d",
              100: "#1e376b",
              200: "#1b488e",
              300: "#175ab1",
              400: "#126bd5",
              500: "#587ee0", // your provided blue
              600: "#829fe3",
              700: "#adc0e7",
              800: "#d7e0ea",
              900: "#f3f8ff",
              DEFAULT: "#587ee0",
              foreground: "#000000",
            },
            secondary: {
              50: "#332008",
              100: "#66400f",
              200: "#995f17",
              300: "#cc881f",
              400: "#ffaa28",
              500: "#ffba51",
              600: "#ffcb7a",
              700: "#ffdba3",
              800: "#ffebcc",
              900: "#fff8e6",
              DEFAULT: "#ffaa28",
              foreground: "#000000",
            },
            success: {
              50: "#12551f",
              100: "#1a7037",
              200: "#228c50",
              300: "#2ba169",
              400: "#33c682",
              500: "#4de19e",
              600: "#73e7b2",
              700: "#99edc7",
              800: "#bff3db",
              900: "#e5f9f0",
              DEFAULT: "#33c682",
              foreground: "#000000",
            },
            warning: {
              50: "#66400f",
              100: "#995f17",
              200: "#cc881f",
              300: "#ffaa28",
              400: "#ffb34d",
              500: "#ffc373",
              600: "#ffd399",
              700: "#ffe4bf",
              800: "#fff4e5",
              900: "#fff8e6",
              DEFAULT: "#ffaa28",
              foreground: "#000000",
            },
            danger: {
              50: "#330808",
              100: "#661010",
              200: "#991818",
              300: "#cc2020",
              400: "#ff2828",
              500: "#ff4d4d",
              600: "#ff7373",
              700: "#ff9999",
              800: "#ffbfbf",
              900: "#ffe5e5",
              DEFAULT: "#ff2828",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

export default config;
