import { colorHex } from '../../src/woynu-ai/shared/options.js'
import type { GeneratedDesign, StyleSpecification } from '../../src/woynu-ai/shared/types.js'
import { WoynuAiError } from './errors.js'

/** Any image model can power Woynu AI by implementing this interface. */
export interface ImageGenerationProvider {
  readonly name: string
  generateDesign(prompt: string, context: { spec: StyleSpecification; signal: AbortSignal }): Promise<GeneratedDesign>
}

export type ProviderEnv = {
  IMAGE_GENERATION_PROVIDER?: string
  IMAGE_GENERATION_API_KEY?: string
  IMAGE_GENERATION_MODEL?: string
  IMAGE_GENERATION_QUALITY?: string
}

const ALT = 'AI-generated Wolaita-inspired fashion design concept by Woynu AI'

/**
 * OpenAI Images API (gpt-image-1). Called with fetch so no SDK is needed.
 * Returns a compressed JPEG as a data URL to keep the response small.
 */
export class OpenAIImageProvider implements ImageGenerationProvider {
  readonly name = 'openai'
  private readonly apiKey: string
  private readonly model: string
  private readonly quality: string
  private readonly fetchImpl: typeof fetch

  constructor(options: { apiKey: string; model?: string; quality?: string; fetchImpl?: typeof fetch }) {
    this.apiKey = options.apiKey
    this.model = options.model || 'gpt-image-1'
    this.quality = options.quality || 'medium'
    this.fetchImpl = options.fetchImpl ?? fetch
  }

  async generateDesign(
    prompt: string,
    { signal }: { spec: StyleSpecification; signal: AbortSignal },
  ): Promise<GeneratedDesign> {
    let response: Response
    try {
      response = await this.fetchImpl('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        signal,
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          n: 1,
          size: '1024x1536',
          quality: this.quality,
          output_format: 'jpeg',
          output_compression: 82,
        }),
      })
    } catch (err) {
      if (signal.aborted) throw new WoynuAiError('timeout', 504, { cause: err })
      throw new WoynuAiError('generation_failed', 502, { cause: err })
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      if (response.status === 429) throw new WoynuAiError('rate_limited', 429, { cause: detail })
      if (response.status === 400 && /moderation|safety|content_policy/i.test(detail)) {
        throw new WoynuAiError('content_rejected', 422, { cause: detail })
      }
      if (response.status === 401 || response.status === 403) {
        throw new WoynuAiError('not_configured', 503, { cause: `Provider auth failed (${response.status})` })
      }
      throw new WoynuAiError('generation_failed', 502, { cause: `Provider ${response.status}: ${detail.slice(0, 300)}` })
    }

    const json = (await response.json().catch(() => null)) as { data?: { b64_json?: string; url?: string }[] } | null
    const item = json?.data?.[0]
    const imageUrl = item?.b64_json ? `data:image/jpeg;base64,${item.b64_json}` : item?.url
    if (!imageUrl || (item?.url && !/^https:\/\//.test(item.url))) {
      throw new WoynuAiError('generation_failed', 502, { cause: 'Unexpected provider response shape' })
    }
    return { imageUrl, alt: ALT, provider: this.name, mode: 'ai' }
  }
}

/**
 * Local-testing provider: draws the chosen palette as an SVG card clearly marked
 * "Preview". It never pretends to be an AI image. Enabled only with
 * IMAGE_GENERATION_PROVIDER=preview.
 */
export class PreviewImageProvider implements ImageGenerationProvider {
  readonly name = 'preview'

  async generateDesign(_prompt: string, { spec }: { spec: StyleSpecification }): Promise<GeneratedDesign> {
    const [primary, secondary] = spec.palette.map(colorHex)
    const accent = secondary ?? '#DEA052'
    const stripes = Array.from({ length: 7 }, (_, i) => {
      const x = 330 + i * 14
      return `<rect x="${x}" y="360" width="7" height="820" fill="${i % 2 ? accent : '#141111'}" opacity="0.9"/>`
    }).join('')
    const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1152">
<rect width="768" height="1152" fill="#100e0d"/>
<path d="M300 250 L468 250 L520 1180 L248 1180 Z" fill="${primary}"/>
<path d="M300 250 L468 250 L480 430 L288 430 Z" fill="${accent}" opacity="0.9"/>
${stripes}
<circle cx="384" cy="190" r="52" fill="#3a2a20"/>
<text x="384" y="90" fill="#DEA052" font-family="Georgia, serif" font-size="30" text-anchor="middle" letter-spacing="6">PREVIEW</text>
<text x="384" y="1110" fill="#F0EEEB" font-family="Georgia, serif" font-size="26" text-anchor="middle">${escape(spec.title)}</text>
</svg>`
    return {
      imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      alt: `Preview sketch of the ${spec.title} palette — not an AI-generated image`,
      provider: this.name,
      mode: 'preview',
    }
  }
}

/** Chooses the provider from environment variables. Add new providers here. */
export function createImageProvider(env: ProviderEnv, fetchImpl?: typeof fetch): ImageGenerationProvider {
  const provider = (env.IMAGE_GENERATION_PROVIDER || 'openai').toLowerCase()
  if (provider === 'preview') return new PreviewImageProvider()
  if (provider === 'openai') {
    if (!env.IMAGE_GENERATION_API_KEY) throw new WoynuAiError('not_configured', 503, { cause: 'IMAGE_GENERATION_API_KEY missing' })
    return new OpenAIImageProvider({
      apiKey: env.IMAGE_GENERATION_API_KEY,
      model: env.IMAGE_GENERATION_MODEL,
      quality: env.IMAGE_GENERATION_QUALITY,
      fetchImpl,
    })
  }
  throw new WoynuAiError('not_configured', 503, { cause: `Unknown provider "${provider}"` })
}
