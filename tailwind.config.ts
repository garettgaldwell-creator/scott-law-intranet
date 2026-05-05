import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./server/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        graphite: "#151515",
        gold: "#d9b766",
        "gold-soft": "#f3df9a",
        ivory: "#f8f4ea"
      },
      boxShadow: {
        gold: "0 18px 60px rgba(217, 183, 102, 0.16)"
      }
    }
  },
  plugins: []
}

export default config
