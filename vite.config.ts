import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => ({
  base: '/trenton.who/',
  plugins: [react()],
  publicDir: "./static",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
}));
