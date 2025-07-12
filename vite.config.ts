import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getReplitPlugins() {
  let runtimeErrorOverlay;
  let cartographer;
  try {
    runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
    cartographer = await import("@replit/vite-plugin-cartographer");
  } catch (e) {
    runtimeErrorOverlay = undefined;
    cartographer = undefined;
  }
  return { runtimeErrorOverlay, cartographer };
}

export default defineConfig(async () => {
  const { runtimeErrorOverlay, cartographer } = await getReplitPlugins();
  return {
    plugins: [
      react(),
      ...(runtimeErrorOverlay ? [runtimeErrorOverlay()] : []),
      ...(process.env.NODE_ENV !== "production" && cartographer
        ? [cartographer.cartographer()]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
