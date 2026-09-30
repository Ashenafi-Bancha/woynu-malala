import type {
  TryOnApiResponse,
  TryOnRequest,
  TryOnResult,
  WoynuApiResponse,
  WoynuErrorCode,
  WoynuPreferences,
  WoynuStyleResult,
} from './shared/types'

export class WoynuRequestError extends Error {
  readonly code: WoynuErrorCode | 'network'
  constructor(code: WoynuErrorCode | 'network') {
    super(code)
    this.code = code
  }
}

const CLIENT_TIMEOUT_MS = 125_000

/** Sends structured preferences to the Woynu AI backend. Never talks to an AI provider directly. */
export async function requestWoynuStyle(preferences: WoynuPreferences, signal?: AbortSignal): Promise<WoynuStyleResult> {
  const timeout = AbortSignal.timeout(CLIENT_TIMEOUT_MS)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout

  let response: Response
  try {
    response = await fetch('/api/woynu-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
      signal: combined,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    throw new WoynuRequestError(timeout.aborted ? 'timeout' : 'network')
  }

  const data = (await response.json().catch(() => null)) as WoynuApiResponse | null
  if (!data || typeof data !== 'object' || !('ok' in data)) throw new WoynuRequestError('generation_failed')
  if (!data.ok) throw new WoynuRequestError(data.error?.code ?? 'generation_failed')
  if (!data.result?.design?.imageUrl) throw new WoynuRequestError('generation_failed')
  return data.result
}

/** Sends the visitor's resized photo and their design for a virtual try-on. Nothing is stored. */
export async function requestTryOn(request: TryOnRequest, signal?: AbortSignal): Promise<TryOnResult> {
  const timeout = AbortSignal.timeout(CLIENT_TIMEOUT_MS)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout

  let response: Response
  try {
    response = await fetch('/api/woynu-ai/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: combined,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    throw new WoynuRequestError(timeout.aborted ? 'timeout' : 'network')
  }

  const data = (await response.json().catch(() => null)) as TryOnApiResponse | null
  if (!data || typeof data !== 'object' || !('ok' in data)) throw new WoynuRequestError('generation_failed')
  if (!data.ok) throw new WoynuRequestError(data.error?.code ?? 'generation_failed')
  if (!data.result?.imageUrl) throw new WoynuRequestError('generation_failed')
  return data.result
}
