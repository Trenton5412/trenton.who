import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => ({
  base: '/trenton.who/',
  plugins: [react()],
  publicDir: "public",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  server: {
    fs: {
      strict: false
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    assetsInlineLimit: 0, // 防止大檔案被內聯
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.webm')) {
            return 'assets/videos/[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    }
  }
}));
