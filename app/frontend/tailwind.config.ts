import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orbital Calm Base Colors
        navy: {
          900: "var(--navy-900)",
        },
        bone: {
          50: "var(--bone-50)",
        },
        gray: {
          300: "var(--gray-300)",
        },
        slate: {
          500: "var(--slate-500)",
          600: "#4A5A72", // darker variant for hover
        },
        teal: {
          500: "var(--teal-500)",
          600: "#3D6161", // darker variant for hover
        },
        gold: {
          500: "var(--gold-500)",
        },

        // Semantic Colors
        primary: "var(--slate-500)",
        secondary: "var(--teal-500)",
        accent: "var(--gold-500)",
        background: "var(--background)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",

        // Legacy compatibility
        foreground: "var(--foreground)",

        // State Colors
        success: {
          bg: "var(--success-bg)",
          text: "var(--success-text)",
        },
        info: {
          bg: "var(--info-bg)",
          text: "var(--info-text)",
        },
        danger: {
          bg: "var(--danger-bg)",
          text: "var(--danger-text)",
        },

        // Keep error for backwards compatibility
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      borderRadius: {
        card: "20px",
        input: "16px",
        pill: "999px",
        // Keep defaults for backwards compatibility
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        "inner-soft": "var(--shadow-inset)",
        // Keep defaults for backwards compatibility
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      fontFamily: {
        heading: "var(--font-heading), Inter, system-ui, sans-serif",
        body: "var(--font-body), system-ui, sans-serif",
        mono: "var(--font-mono), ui-monospace, monospace",
      },
    },
  },
  plugins: [],
} satisfies Config;
