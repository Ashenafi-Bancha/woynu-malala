/**
 * Simple fixed-window rate limiter keyed by client IP.
 * In-memory, so on serverless it limits per warm instance; swap for a shared store
 * (e.g. Vercel KV / Upstash Redis) when traffic grows.
 */
export function createRateLimiter(options: { limit: number; windowMs: number; now?: () => number }) {
  const hits = new Map<string, { count: number; resetAt: number }>()
  const now = options.now ?? Date.now

  return {
    /** Returns true if the request is allowed. */
    take(key: string): boolean {
      const t = now()
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k)
      }
      const entry = hits.get(key)
      if (!entry || entry.resetAt <= t) {
        hits.set(key, { count: 1, resetAt: t + options.windowMs })
        return true
      }
      if (entry.count >= options.limit) return false
      entry.count += 1
      return true
    },
  }
}
