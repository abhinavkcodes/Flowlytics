import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#03050a",
        bg1: "#080d18",
        bg2: "#0d1526",
        text: "#eef2ff",
        "text-mid": "#8892aa",
        "text-dim": "#3d4a63",
        "brand-gray": "#111111",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Outfit", "sans-serif"],
        aurora: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;