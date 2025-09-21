import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
        // Custom space weather colors
        aurora: {
          green: "hsl(var(--aurora-green))",
          blue: "hsl(var(--aurora-blue))",
          purple: "hsl(var(--aurora-purple))",
        },
        solar: {
          orange: "hsl(var(--solar-orange))",
        },
        cosmic: {
          purple: "hsl(var(--cosmic-purple))",
        },
        space: {
          navy: "hsl(var(--space-navy))",
        },
        nebula: {
          pink: "hsl(var(--nebula-pink))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Space-themed animations
        "storm-shake": {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(-2px) translateY(-1px)" },
          "50%": { transform: "translateX(2px) translateY(1px)" },
          "75%": { transform: "translateX(-1px) translateY(2px)" },
        },
        "gps-drift": {
          "0%, 100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "33%": { transform: "translateX(5px) translateY(-3px) rotate(2deg)" },
          "66%": { transform: "translateX(-3px) translateY(4px) rotate(-1deg)" },
        },
        "power-flicker": {
          "0%": { opacity: "1", filter: "brightness(1)" },
          "100%": { opacity: "0.3", filter: "brightness(0.3)" },
        },
        "cosmic-wave": {
          "0%": { transform: "translateX(-100%) scaleY(1)", opacity: "0" },
          "50%": { opacity: "0.8", transform: "translateX(50%) scaleY(1.2)" },
          "100%": { transform: "translateX(200%) scaleY(1)", opacity: "0" },
        },
        "star-twinkle": {
          "0%": { opacity: "0.3", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1.2)" },
        },
        "aurora-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scaleY(1)" },
          "50%": { opacity: "1", transform: "scaleY(1.1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Space-themed animations
        "storm-shake": "storm-shake 0.5s ease-in-out infinite",
        "gps-drift": "gps-drift 3s ease-in-out infinite",
        "power-flicker": "power-flicker 0.3s ease-in-out infinite alternate",
        "cosmic-wave": "cosmic-wave 4s ease-in-out infinite",
        "star-twinkle": "star-twinkle 2s ease-in-out infinite alternate",
        "aurora-pulse": "aurora-pulse 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
