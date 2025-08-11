import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  if (isDev) {
    // Development server configuration
    return {
      plugins: [react(), tailwindcss()],
      root: ".",
      publicDir: "public",
    };
  }

  // Build configuration for library
  return {
    plugins: [react(), tailwindcss()],
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, "src/index.ts"),
        name: "react-meet",
        // the proper extensions will be added
        fileName: "index",
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react-dom"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  };
});
