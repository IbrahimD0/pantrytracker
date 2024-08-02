import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: "#dd6e42",
          100: "#311409",
          200: "#612811",
          300: "#923c1a",
          400: "#c25022",
          500: "#dd6e42",
          600: "#e48a66",
          700: "#eba78d",
          800: "#f2c5b3",
          900: "#f8e2d9",
        },
        base: {
          DEFAULT: "#e8dab2",
          100: "#3f3313",
          200: "#7e6626",
          300: "#bc9938",
          400: "#d5ba72",
          500: "#e8dab2",
          600: "#ece0c0",
          700: "#f1e8d0",
          800: "#f6f0e0",
          900: "#faf7ef",
        },
        primary: {
          DEFAULT: "#4f6d7a",
          100: "#101618",
          200: "#1f2b30",
          300: "#2f4148",
          400: "#3f5660",
          500: "#4f6d7a",
          600: "#688d9d",
          700: "#8eaab5",
          800: "#b4c6ce",
          900: "#d9e3e6",
        },
        secondary: {
          DEFAULT: "#c0d6df",
          100: "#1c2f37",
          200: "#375e6e",
          300: "#538ea5",
          400: "#88b2c3",
          500: "#c0d6df",
          600: "#cbdee5",
          700: "#d8e6ec",
          800: "#e5eef2",
          900: "#f2f7f9",
        },
        background: {
          DEFAULT: "#eaeaea",
          100: "#2f2f2f",
          200: "#5e5e5e",
          300: "#8d8d8d",
          400: "#bcbcbc",
          500: "#eaeaea",
          600: "#efefef",
          700: "#f3f3f3",
          800: "#f7f7f7",
          900: "#fbfbfb",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
} satisfies Config;

export default config;
