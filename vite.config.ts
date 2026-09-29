import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Serves the Woynu AI serverless function (api/woynu-ai.ts) during `npm run dev`,
 * so local development uses exactly the same handler as Vercel.
 */
function woynuAiDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'woynu-ai-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/woynu-ai', async (req: IncomingMessage, res: ServerResponse) => {
        const chunks: Buffer[] = []
        let size = 0
        for await (const chunk of req) {
          size += (chunk as Buffer).length
          if (size > 64 * 1024) break
          chunks.push(chunk as Buffer)
        }
        const headers = new Headers()
        for (const [key, value] of Object.entries(req.headers)) {
          if (typeof value === 'string') headers.set(key, value)
        }
        // Connect strips the mount path from req.url; the handler doesn't route on it anyway.
        const request = new Request(`http://${req.headers.host}/api/woynu-ai`, {
          method: req.method,
          headers,
          body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
        })
        const mod = (await server.ssrLoadModule('/server/woynu-ai/woynuAiService.ts')) as typeof import('./server/woynu-ai/woynuAiService')
        const response = await mod.handleWoynuAiRequest(request, { ...env, ...process.env })
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
