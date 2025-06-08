import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@mapbox"], // https://stackoverflow.com/a/78494242
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
