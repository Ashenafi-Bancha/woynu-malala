import { social } from '../content/site'

/** WhatsApp link to the studio with a message already written. Empty lines are dropped. */
export function whatsappUrl(lines: (string | false | null | undefined)[]): string {
  const text = lines.filter(Boolean).join('\n')
  return `${social.whatsapp.href}?text=${encodeURIComponent(text)}`
}

/** Opens WhatsApp (app on phones, WhatsApp Web on computers) in a new tab. */
export function openWhatsApp(lines: (string | false | null | undefined)[]) {
  window.open(whatsappUrl(lines), '_blank', 'noopener,noreferrer')
}
