import type { WoynuErrorCode } from '../../src/woynu-ai/shared/types.js'

/** An error that is safe to show visitors. Internal details stay in `cause` for server logs. */
export class WoynuAiError extends Error {
  readonly code: WoynuErrorCode
  readonly status: number

  constructor(code: WoynuErrorCode, status: number, options?: { cause?: unknown }) {
    super(PUBLIC_MESSAGES[code], options)
    this.code = code
    this.status = status
  }
}

export const PUBLIC_MESSAGES: Record<WoynuErrorCode, string> = {
  consent_required: 'Please confirm the photo consent to continue.',
  invalid_photo: 'Please choose a clear JPG, PNG, or WebP photo.',
  not_allowed_for_age: 'Photo try-on is available for adults only.',
  invalid_input: 'Please check your choices and try again.',
  payload_too_large: 'Your request is too large. Please shorten your note and try again.',
  method_not_allowed: 'This request is not supported.',
  rate_limited: 'You have created several styles in a short time. Please wait a few minutes and try again.',
  timeout: 'Creating your style took too long. Please try again.',
  content_rejected: 'We couldn’t create this style. Please adjust your choices and try again.',
  not_configured: 'Woynu AI is not available right now. Please try again later.',
  generation_failed: 'We couldn’t create your style right now. Please try again.',
}
