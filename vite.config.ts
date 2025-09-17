import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  
  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          // This will transform your SVG to a React component
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }),
    ],
    server: {
      // In development, Vite handles SPA routing automatically
      port: 3000,
      open: true,
    },
    build: {
      // For production builds
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: isProduction,
      cssMinify: isProduction,
      // Improve chunking strategy for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['react-router', 'react-router-dom'],
            vendor: ['axios', 'apexcharts', 'react-apexcharts'],
          },
        },
      },
    },
  };
});
