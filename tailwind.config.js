/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf6",
          100: "#d3f5e8",
          200: "#aae9d4",
          300: "#74d6b9",
          400: "#3dbd9a",
          500: "#1ea382",
          600: "#12836a",
          700: "#106858",
          800: "#0f5348",
          900: "#0e453d",
          950: "#03271f",
        },
        accent: {
          50: "#fff4ed",
          100: "#ffe6d5",
          200: "#ffc8aa",
          300: "#ffa174",
          400: "#fb7b45",
          500: "#f05d28",
          600: "#d84116",
          700: "#b33113",
          800: "#922a17",
          900: "#772616",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5dae3",
          300: "#b0b9c9",
          400: "#8593aa",
          500: "#65758f",
          600: "#505d76",
          700: "#424c61",
          800: "#394152",
          900: "#333947",
          950: "#1d212b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,.04), 0 12px 32px -12px rgba(16,24,40,.18)",
        lift: "0 8px 16px -6px rgba(16,104,88,.22), 0 20px 44px -18px rgba(16,104,88,.28)",
        ring: "0 0 0 1px rgba(16,104,88,.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(.96) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.85)", opacity: ".7" },
          "70%": { transform: "scale(1.35)", opacity: "0" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        "float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.22,.61,.36,1) both",
        "fade-in": "fade-in .5s ease both",
        "scale-in": "scale-in .35s cubic-bezier(.22,.61,.36,1) both",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(.24,.62,.36,1) infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
