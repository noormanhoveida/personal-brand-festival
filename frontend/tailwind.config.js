/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
      },
      colors: {
        // Theme 1: Midnight Identity
        midnight: {
          bg: "#07121F",
          bg2: "#0B1B2B",
          surface: "#102235",
          accent: "#C9A24B", // warm gold
          text: "#F5F5F5",
        },
        // Theme 2: Obsidian Growth
        obsidian: {
          bg: "#080808",
          surface: "#141414",
          accent: "#4F8CFF", // electric blue
          text: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
