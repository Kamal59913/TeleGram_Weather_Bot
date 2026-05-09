import path from "path";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Scan shared package in monorepo
    path.join(__dirname, "../../packages/common/src/**/*.{js,ts,jsx,tsx}"),
  ],

  theme: {
    extend: {
      colors: {
        // Retain Tailwind default colors
        ...colors,

        // Custom colors
        primary: "#D16DF2",
        secondary: "#292929",
        red: "#DB1515",
        white: "#FFFFFF",
        gray: "#F5F5F5",
        green: "#20A29B",
        fade: "#949494",

        // Dark mode colors
        darkbg: "#363636",
        darksecond: "#202020",
        darkfirst: "#2E2E2E",
        border: "#323232",
        darkfade: "#A8A8A8",
      },
    },
  },

  plugins: [],
};
