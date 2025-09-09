import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@techsplore/schemas': new URL('../../packages/schemas/src', import.meta.url).pathname,
      '@techsplore/db': new URL('../../packages/db/src', import.meta.url).pathname,
      '@techsplore/env': new URL('../../packages/env/src/index.ts', import.meta.url).pathname,
      '@techsplore/ui': new URL('../../packages/ui/src', import.meta.url).pathname,
    },
  },
})
