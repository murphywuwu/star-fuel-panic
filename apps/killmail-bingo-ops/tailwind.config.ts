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
      boxShadow: {
        tactical: "0 0 0 1px #333, 0 0 24px rgba(229, 179, 43, 0.15)"
      },
      backgroundImage: {
        "scan-grid": "linear-gradient(to right, rgba(224,224,224,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(224,224,224,0.06) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "16px 16px"
      }
    }
  },
  plugins: []
};

export default config;
