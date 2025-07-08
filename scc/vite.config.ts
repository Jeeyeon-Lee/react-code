import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from "vite-plugin-svgr";
import * as path from "path";

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  console.log(`현재 모드: ${mode}`);

  return {
    plugins: [react(), svgrPlugin()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
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
          find:"@utils",
          replacement: path.resolve(__dirname,"src/utils")
        }
      ]
    },
  }
});