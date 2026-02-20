import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      // ─── Tipografía SDE Oficios ─────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },

      // ─── Colores — Bandera de Santiago del Estero ───────────────────────
      colors: {
        // Sistema shadcn (no tocar — necesarios para los componentes UI)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
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

        // ── Paleta de marca SDE Oficios ───────────────────────────────────
        sde: {
          celeste: "#75AADB",   // Primario — header, botones, enlaces
          rojo: "#D21010",   // CTA fuerte — "Publicar aviso"
          dorado: "#FCBF49",   // Acento — estrellas, iconos, estados
          blanco: "#FFFFFF",   // Fondo principal
          gris: "#F7F7F7",   // Fondo alternativo de secciones
          texto: "#222222",   // Texto principal
          "celeste-claro": "#E8F2FB",  // Fondo suave celeste (badges, pills)
          "celeste-hover": "#5A95CC",  // Hover del primario
          "rojo-claro": "#FDE8E8",  // Fondo badge rojo
          "dorado-claro": "#FEF3D7",  // Fondo badge dorado
        },

        // ── Contacto WhatsApp ─────────────────────────────────────────────
        whatsapp: {
          DEFAULT: "#25D366",
          foreground: "#FFFFFF",
        },

        // ── Estados ───────────────────────────────────────────────────────
        available: "#22C55E",   // Verde disponible
        unavailable: "#9CA3AF",   // Gris no disponible
        verified: "#75AADB",   // Celeste verificado (= primario)

        // Sidebar admin (mantiene el dark theme)
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

      // ─── Border radius ──────────────────────────────────────────────────
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ─── Animaciones ────────────────────────────────────────────────────
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in-scale": { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-in-scale": "fade-in-scale 0.3s ease-out forwards",
      },

      // ─── Sombras de marca ───────────────────────────────────────────────
      boxShadow: {
        "sde": "0 4px 24px rgba(117, 170, 219, 0.18)",
        "card": "0 2px 12px rgba(34, 34, 34, 0.07)",
        "card-hover": "0 6px 24px rgba(34, 34, 34, 0.12)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
