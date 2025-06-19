import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from "vite-plugin-svgr";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgrPlugin()],
  server: {
    port: 3000,
  },
  resolve:{ //추가
    alias:[
      {
      find : "@src",
      replacement : path.resolve(__dirname, "src")
      },
      {
        find:"@components",
        replacement: path.resolve(__dirname,"src/components")
      },
      {
        find:"@pages",
        replacement: path.resolve(__dirname,"src/pages")
      },
      {
        find:"@api",
        replacement: path.resolve(__dirname,"src/axios")
      },
      {
        find:"@contexts",
        replacement: path.resolve(__dirname,"src/contexts")
      },
      {
        find:"@query",
        replacement: path.resolve(__dirname,"src/query")
      },
      {
        find:"@hooks",
        replacement: path.resolve(__dirname,"src/hooks")
      },
      {
        find:"@stores",
        replacement: path.resolve(__dirname,"src/stores")
      },
      {
        find:"@types",
        replacement: path.resolve(__dirname,"src/types")
      },
      {
        find:"@utils",
        replacement: path.resolve(__dirname,"src/utils")
      }
    ]
  },
})