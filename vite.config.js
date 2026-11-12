import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Unique id per build. The page bakes it in, and the build also writes it to
// /version.json so open tabs can detect that a newer deploy is live.
const BUILD_ID = String(Date.now())

const versionFile = () => ({
  name: 'emit-version-json',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify({ build: BUILD_ID }),
    })
  },
})

export default defineConfig({
  plugins: [react(), versionFile()],
  base: '/',
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
})
