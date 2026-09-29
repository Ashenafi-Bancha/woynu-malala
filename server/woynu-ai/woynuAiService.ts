import type { WoynuApiResponse, WoynuStyleResult } from '../../src/woynu-ai/shared/types.js'
import { validatePreferences } from '../../src/woynu-ai/shared/validation.js'
import { culturalRules } from './culturalRules.js'
import { buildStyleSpecification } from './designSpec.js'
import { PUBLIC_MESSAGES, WoynuAiError } from './errors.js'
import { createImageProvider, type ImageGenerationProvider, type ProviderEnv } from './imageGeneration.js'
import { buildWoynuStylePrompt } from './promptBuilder.js'
import { createRateLimiter } from './rateLimit.js'

export const MAX_BODY_BYTES = 4096
const DEFAULT_TIMEOUT_MS = 90_000

export type WoynuAiEnv = ProviderEnv & {
  /** Comma-separated extra origins allowed to call the API (same-origin is always allowed) */
  WOYNU_AI_ALLOWED_ORIGINS?: string
  WOYNU_AI_RATE_LIMIT?: string
}

export type WoynuAiDeps = {
  provider?: ImageGenerationProvider
  rateLimiter?: { take(key: string): boolean }
  timeoutMs?: number
  log?: (message: string, detail?: unknown) => void
}

const defaultLimiter = createRateLimiter({ limit: 6, windowMs: 10 * 60_000 })

const json = (body: WoynuApiResponse, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  })

const fail = (err: WoynuAiError, fields?: Record<string, string>) =>
  json({ ok: false, error: { code: err.code, message: err.message, ...(fields ? { fields } : {}) } }, err.status)

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'unknown'
}

function originAllowed(request: Request, env: WoynuAiEnv): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // same-origin requests from some browsers and server-side tools
  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    return false
  }
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (host && originHost === host) return true
  const extra = (env.WOYNU_AI_ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
  return extra.includes(origin)
}

/**
 * POST /api/woynu-ai
 * Web-standard handler shared by the Vercel function and the Vite dev server.
 */
export async function handleWoynuAiRequest(
  request: Request,
  env: WoynuAiEnv,
  deps: WoynuAiDeps = {},
): Promise<Response> {
  const log = deps.log ?? ((message, detail) => console.error(`[woynu-ai] ${message}`, detail ?? ''))

  try {
    if (request.method !== 'POST') {
      return fail(new WoynuAiError('method_not_allowed', 405))
    }
    if (!originAllowed(request, env)) {
      return fail(new WoynuAiError('method_not_allowed', 403))
    }
    const declared = Number(request.headers.get('content-length') || 0)
    if (declared > MAX_BODY_BYTES) return fail(new WoynuAiError('payload_too_large', 413))

    const body = await request.text()
    if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
      return fail(new WoynuAiError('payload_too_large', 413))
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(body)
    } catch {
      return fail(new WoynuAiError('invalid_input', 400))
    }

    const validation = validatePreferences(parsed)
    if (!validation.ok) return fail(new WoynuAiError('invalid_input', 400), validation.errors as Record<string, string>)

    const limiter = deps.rateLimiter ?? defaultLimiter
    if (!limiter.take(clientKey(request))) {
      return json(
        { ok: false, error: { code: 'rate_limited', message: PUBLIC_MESSAGES.rate_limited } },
        429,
        { 'Retry-After': '600' },
      )
    }

    const prefs = validation.value
    const { specification, rules } = buildStyleSpecification(prefs, culturalRules)
    const prompt = buildWoynuStylePrompt(prefs, specification, rules)
    const provider = deps.provider ?? createImageProvider(env)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), deps.timeoutMs ?? DEFAULT_TIMEOUT_MS)
    let design
    try {
      design = await provider.generateDesign(prompt, { spec: specification, signal: controller.signal })
    } catch (err) {
      if (controller.signal.aborted && !(err instanceof WoynuAiError)) throw new WoynuAiError('timeout', 504, { cause: err })
      throw err
    } finally {
      clearTimeout(timer)
    }

    const result: WoynuStyleResult = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      preferences: prefs,
      specification,
      design,
    }
    return json({ ok: true, result }, 200)
  } catch (err) {
    if (err instanceof WoynuAiError) {
      log(err.code, err.cause)
      return fail(err)
    }
    log('unexpected', err)
    return fail(new WoynuAiError('generation_failed', 500))
  }
}
