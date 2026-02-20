import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    // Code splitting manual para reducir el chunk principal
    rollupOptions: {
      output: {
        manualChunks: {
          // Dependencias grandes en chunks separados (se cachean por separado)
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-toast",
            "@radix-ui/react-select", "@radix-ui/react-accordion"],
          "emailjs-vendor": ["@emailjs/browser"],
        },
      },
    },
    // Aumenta el límite de advertencia a 700KB (después del splitting debería bajar)
    chunkSizeWarningLimit: 700,
  },
}));
