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
      }
    ]
  },
})