import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        dm: ["DM Sans", "system-ui", "sans-serif"],
        cormorant: ["Cormorant Garamond", "Georgia", "serif"],
        // legacy
        lato: ["Inter", "system-ui", "sans-serif"],
        merriweather: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // ── Brand ─────────────────────────────────────────────
        navy: {
          DEFAULT: "#0B1D2E",
          light: "#1A3A5C",
          50: "#e8f0f8",
          100: "#c5d7ed",
          900: "#0B1D2E",
        },
        gold: {
          DEFAULT: "#D4A843",
          light: "#E8C96A",
          glow: "rgba(212,168,67,0.15)",
          50: "#fdf8ee",
          100: "#f8edd0",
          200: "#f0d99a",
          300: "#E8C96A",
          400: "#D4A843",
          500: "#b88b2e",
          600: "#9a7226",
        },
        warm: {
          50: "#FAFAFA",
          100: "#F5F0E8",
        },

        // ── Semantic ───────────────────────────────────────────
        primary: {
          DEFAULT: "#0B1D2E",
          foreground: "#FAFAFA",
        },
        secondary: {
          DEFAULT: "#F5F0E8",
          foreground: "#0B1D2E",
        },
        accent: {
          DEFAULT: "#D4A843",
          foreground: "#0B1D2E",
        },
        muted: {
          DEFAULT: "#F5F0E8",
          foreground: "#6B7280",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 50%, #0B1D2E 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #D4A843 0%, #E8C96A 50%, #D4A843 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, #D4A843 0%, #E8C96A 40%, #f5df9e 60%, #D4A843 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // shadcn defaults
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Custom
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,168,67,0.5)" },
          "70%": { boxShadow: "0 0 0 12px rgba(212,168,67,0)" },
        },
        "whatsapp-pulse": {
          "0%":   { boxShadow: "0 0 0 0 rgba(34,197,94,0.35)" },
          "60%":  { boxShadow: "0 0 0 10px rgba(34,197,94,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(34,197,94,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        blob: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        "wave-move": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(-10px)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(212,168,67,0.4), 0 0 40px rgba(212,168,67,0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(212,168,67,0.6), 0 0 60px rgba(212,168,67,0.3)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
        "gold-pulse": "gold-pulse 2s ease-out infinite",
        "whatsapp-pulse": "whatsapp-pulse 3.5s ease-out infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-x": "bounce-x 1s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
        "slide-out-right": "slide-out-right 0.25s ease-in",
        blob: "blob 8s ease-in-out infinite",
        "wave-slow": "wave-move 22s linear infinite",
        "wave-med": "wave-move 14s linear infinite",
        "wave-fast": "wave-move 9s linear infinite",
        "bounce-slow": "bounce-slow 2s infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      boxShadow: {
        gold: "0 4px 24px rgba(212,168,67,0.35)",
        "gold-lg": "0 8px 40px rgba(212,168,67,0.4)",
        navy: "0 4px 24px rgba(11,29,46,0.3)",
        "navy-lg": "0 8px 40px rgba(11,29,46,0.45)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
