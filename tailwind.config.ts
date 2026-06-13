import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bg1: "var(--bg1)",
        bg2: "var(--bg2)",
        surface: "var(--surface)",
        border: "var(--border)",
        "border-hi": "var(--border-hi)",
        text: "var(--text)",
        "text-mid": "var(--text-mid)",
        "text-dim": "var(--text-dim)",
        blue: "var(--blue)",
        "blue-hi": "var(--blue-hi)",
        cyan: "var(--cyan)",
        green: "var(--green)",
        lime: "var(--lime)",
        amber: "var(--amber)",
        orange: "var(--orange)",
        rose: "var(--rose)",
      purple: "var(--purple)",
        pink: "var(--pink)",
        "brand-gray": "#1A1A1A",
      },
      fontFamily: {
        display: ["Cabinet Grotesk", "Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Outfit", "sans-serif"],
        aurora: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "none" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 0.4s ease both",
        pulseSoft: "pulseSoft 2s infinite",
        spinSlow: "spinSlow 1s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;