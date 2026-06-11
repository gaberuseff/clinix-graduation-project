import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Separate heavy Recharts and its D3 dependencies
            if (id.includes("recharts") || id.includes("d3")) {
              return "vendor-charts";
            }
            // Separate Sentry logic
            if (id.includes("@sentry")) {
              return "vendor-sentry";
            }
            // Separate Supabase SDK
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            // Separate React core packages
            if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) {
              if (!id.includes("react-router")) {
                return "vendor-react";
              }
            }
            // Separate TanStack Query and Table packages
            if (id.includes("@tanstack")) {
              return "vendor-tanstack";
            }
            // Separate React Router bundle
            if (id.includes("react-router") || id.includes("react-router-dom")) {
              return "vendor-router";
            }
            // Fallback for standard packages
            return "vendor";
          }
        },
      },
    },
  },
})

