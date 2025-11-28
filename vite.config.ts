import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
    // Proxy removed - using production API directly (https://rest.sntrips.com)
  }
})

