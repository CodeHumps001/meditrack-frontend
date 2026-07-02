import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ee",
          100: "#d5ecd6",
          400: "#4c9a50",
          500: "#2e7d32",
          600: "#256a29",
          700: "#1b5e20",
          900: "#0f3a12",
        },
        ink: {
          900: "#111814",
          700: "#33403a",
          500: "#5c6b63",
          300: "#9aa79f",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f5f7f5",
          border: "#e2e8e3",
        },
        warn: "#f57c00",
        danger: "#c62828",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 24, 20, 0.06), 0 1px 8px rgba(17, 24, 20, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
