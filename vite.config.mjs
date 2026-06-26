import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      include: ["**/*.{jsx,ts,tsx}"],
    }),
  ],
  legacy: {
    // Temporary workaround for CJS interop issues in some deps (e.g. react-parallax)
    inconsistentCjsInterop: true,
  },
  optimizeDeps: {
    include: ["react-parallax"],
    needsInterop: ["react-parallax"],
  },
  build: {
    cssMinify: "esbuild",
  },
});

