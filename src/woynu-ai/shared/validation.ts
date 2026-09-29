import {
  ACCESSORIES,
  AGE_GROUPS,
  COLORS,
  GENDERS,
  MAX_ACCESSORIES,
  MAX_NOTE_LENGTH,
  OCCASIONS,
  STYLES,
  type Accessory,
  type WoynuPreferences,
} from './types.js'

export type FieldErrors = Partial<Record<keyof WoynuPreferences, string>>

export type ValidationResult = { ok: true; value: WoynuPreferences } | { ok: false; errors: FieldErrors }

const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (list as readonly string[]).includes(value)

/** Control, zero-width, and bidirectional-override characters, built from code points. */
const INVISIBLE_CHARS = new RegExp(
  `[${[
    [0x00, 0x1f],
    [0x7f, 0x9f],
    [0x200b, 0x200f],
    [0x2028, 0x202e],
    [0xfeff, 0xfeff],
  ]
    .map(([from, to]) => `${String.fromCharCode(from)}-${String.fromCharCode(to)}`)
    .join('')}]`,
  'g',
)

/**
 * Normalises the free-text note: removes control characters and markup/templating
 * characters, collapses whitespace, and caps the length.
 */
export function sanitizeNote(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .normalize('NFC')
    .replace(INVISIBLE_CHARS, ' ')
    .replace(/[<>{}[\]`\\|^~$]/g, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NOTE_LENGTH)
}

/** Validates untrusted input. Used by the form for instant feedback and by the server as the authority. */
export function validatePreferences(input: unknown): ValidationResult {
  const errors: FieldErrors = {}
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: { gender: 'Invalid request.' } }
  }
  const raw = input as Record<string, unknown>

  if (!isOneOf(GENDERS, raw.gender)) errors.gender = 'Please choose an option.'
  if (!isOneOf(AGE_GROUPS, raw.ageGroup)) errors.ageGroup = 'Please choose an age group.'
  if (!isOneOf(OCCASIONS, raw.occasion)) errors.occasion = 'Please choose an occasion.'
  if (!isOneOf(STYLES, raw.stylePreference)) errors.stylePreference = 'Please choose a style.'
  if (!isOneOf(COLORS, raw.primaryColor)) errors.primaryColor = 'Please choose a primary colour.'

  let secondaryColor: WoynuPreferences['secondaryColor']
  if (raw.secondaryColor !== undefined && raw.secondaryColor !== null && raw.secondaryColor !== '') {
    if (!isOneOf(COLORS, raw.secondaryColor)) errors.secondaryColor = 'Unknown colour.'
    else if (raw.secondaryColor === raw.primaryColor) errors.secondaryColor = 'Choose a different secondary colour.'
    else secondaryColor = raw.secondaryColor
  }

  let accessories: Accessory[] = []
  if (raw.accessories !== undefined) {
    if (!Array.isArray(raw.accessories) || !raw.accessories.every((a) => isOneOf(ACCESSORIES, a))) {
      errors.accessories = 'Unknown accessory.'
    } else {
      accessories = [...new Set(raw.accessories as Accessory[])]
      if (accessories.includes('none')) accessories = ['none']
      if (accessories.length > MAX_ACCESSORIES) errors.accessories = `Choose up to ${MAX_ACCESSORIES} accessories.`
    }
  }

  if (raw.additionalPreferences !== undefined && typeof raw.additionalPreferences !== 'string') {
    errors.additionalPreferences = 'Invalid text.'
  } else if (typeof raw.additionalPreferences === 'string' && raw.additionalPreferences.length > MAX_NOTE_LENGTH * 2) {
    errors.additionalPreferences = `Please keep this under ${MAX_NOTE_LENGTH} characters.`
  }

  if (Object.keys(errors).length) return { ok: false, errors }

  const note = sanitizeNote(raw.additionalPreferences)
  return {
    ok: true,
    value: {
      gender: raw.gender as WoynuPreferences['gender'],
      ageGroup: raw.ageGroup as WoynuPreferences['ageGroup'],
      occasion: raw.occasion as WoynuPreferences['occasion'],
      stylePreference: raw.stylePreference as WoynuPreferences['stylePreference'],
      primaryColor: raw.primaryColor as WoynuPreferences['primaryColor'],
      ...(secondaryColor ? { secondaryColor } : {}),
      accessories: accessories.length ? accessories : ['none'],
      ...(note ? { additionalPreferences: note } : {}),
    },
  }
}
