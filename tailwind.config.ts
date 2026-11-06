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
        sukoon: {
          darkest: "#050e08",
          dark: "#08170f",
          surface: "#0e2418",
          elevated: "#143322",
          border: "#1d442e",
          borderLight: "#2e6847",
          muted: "#8fa89a",
          gold: "#d4af37",
          goldLight: "#f4dc8a",
          goldDark: "#9c7c1b",
          goldShadow: "#614c0a",
          emerald: "#10b981",
          emeraldLight: "#34d399",
          emeraldDark: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      backgroundImage: {
        "linear-mesh": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.15), rgba(255, 255, 255, 0))",
        "emerald-mesh": "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08), transparent 60%)",
      },
      boxShadow: {
        "linear-card": "0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        "gold-glow": "0 0 30px rgba(212, 175, 55, 0.2)",
        "emerald-glow": "0 0 30px rgba(16, 185, 129, 0.25)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
