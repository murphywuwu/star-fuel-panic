import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        eve: {
          yellow: "#E5B32B",
          black: "#080808",
          grey: "#1A1A1A",
          red: "#CC3300",
          offwhite: "#E0E0E0"
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Roboto Mono", "Share Tech Mono", "monospace"],
        sans: ["Inter Tight", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
