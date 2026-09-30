import { handleTryOnRequest } from '../../server/woynu-ai/woynuAiService.js'

// Vercel serverless function: POST /api/woynu-ai/try-on
// The visitor's photo is processed in memory and never stored.
export function POST(request: Request): Promise<Response> {
  return handleTryOnRequest(request, process.env)
}
