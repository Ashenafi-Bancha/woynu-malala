import { handleWoynuAiRequest } from '../server/woynu-ai/woynuAiService.js'

// Vercel serverless function: POST /api/woynu-ai
// Secrets are read from environment variables on the server only.
export function POST(request: Request): Promise<Response> {
  return handleWoynuAiRequest(request, process.env)
}
