import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

type ServiceModule = typeof import('./server/woynu-ai/woynuAiService')

/** Dev routes mirroring the Vercel functions in api/ */
const ROUTES: Record<string, keyof Pick<ServiceModule, 'handleWoynuAiRequest' | 'handleTryOnRequest'>> = {
  '/api/woynu-ai': 'handleWoynuAiRequest',
  '/api/woynu-ai/try-on': 'handleTryOnRequest',
}

// Slightly above the handler's own limit so oversized requests get its friendly 413.
const DEV_BODY_LIMIT = 5 * 1024 * 1024

/**
 * Serves the Woynu AI serverless functions during `npm run dev`,
 * so local development uses exactly the same handlers as Vercel.
 */
function woynuAiDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'woynu-ai-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const path = (req.url ?? '').split('?')[0]
        const handlerName = ROUTES[path]
        if (!handlerName) return next()

        const chunks: Buffer[] = []
        let size = 0
        for await (const chunk of req) {
          size += (chunk as Buffer).length
          if (size > DEV_BODY_LIMIT) break
          chunks.push(chunk as Buffer)
        }
        const headers = new Headers()
        for (const [key, value] of Object.entries(req.headers)) {
          if (typeof value === 'string') headers.set(key, value)
        }
        const request = new Request(`http://${req.headers.host}${path}`, {
          method: req.method,
          headers,
          body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
        })
        const mod = (await server.ssrLoadModule('/server/woynu-ai/woynuAiService.ts')) as ServiceModule
        const response = await mod[handlerName](request, { ...env, ...process.env })
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  // '' loads every variable from .env files for the dev API; only VITE_* reach the browser bundle.
  plugins: [react(), tailwindcss(), woynuAiDevApi(loadEnv(mode, process.cwd(), ''))],
  build: {
    // The lazy 3D chunk (Three.js) is ~930 kB raw / 250 kB gzip by nature. It loads only on
    // capable devices after the page is idle, so it never blocks first paint.
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
