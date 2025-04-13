import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        theme1: "#FBF5E5",
        theme2: "#C890A7",
        theme3: "#A35C7A",
        theme4: "#212121",
      },
      fontFamily: {
        prompt: ['"Prompt"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;