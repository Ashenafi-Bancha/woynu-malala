// Woynu AI — types shared by the browser and the server.
// Keep this file free of runtime imports so the serverless function can load it directly.

export const GENDERS = ['female', 'male', 'unspecified'] as const
export const AGE_GROUPS = ['child', 'teen', 'young_adult', 'adult', 'elder'] as const
export const OCCASIONS = [
  'wedding',
  'gifaataa',
  'cultural_celebration',
  'festival',
  'formal_event',
  'family_celebration',
  'everyday',
  'other',
] as const
export const STYLES = ['traditional', 'modern', 'traditional_modern'] as const
export const COLORS = ['white', 'red', 'black', 'amber', 'yellow', 'maroon', 'earth', 'green'] as const
export const ACCESSORIES = [
  'traditional_jewelry',
  'necklace',
  'bracelet',
  'head_accessory',
  'cultural_accessory',
  'none',
] as const

export type Gender = (typeof GENDERS)[number]
export type AgeGroup = (typeof AGE_GROUPS)[number]
export type Occasion = (typeof OCCASIONS)[number]
export type StylePreference = (typeof STYLES)[number]
export type ColorId = (typeof COLORS)[number]
export type Accessory = (typeof ACCESSORIES)[number]

/** What the visitor chooses. This is the only shape the API accepts. */
export type WoynuPreferences = {
  gender: Gender
  ageGroup: AgeGroup
  occasion: Occasion
  stylePreference: StylePreference
  primaryColor: ColorId
  secondaryColor?: ColorId
  accessories: Accessory[]
  additionalPreferences?: string
}

/** Structured design brief built on the server from the preferences and the cultural design layer. */
export type StyleSpecification = {
  title: string
  summary: string
  occasion: Occasion
  stylePreference: StylePreference
  palette: ColorId[]
  accessories: Accessory[]
  clothingConcept: string
  designInspiration: string[]
  /** Descriptors recognised from the visitor's note (never the raw note itself) */
  styleNotes: string[]
  /** Always true: results are inspiration, not verified tradition */
  isInspirationConcept: true
}

export type GeneratedDesign = {
  /** data: URL or https URL of the generated image */
  imageUrl: string
  alt: string
  provider: string
  /** 'preview' means no AI image was generated (local testing without an API key) */
  mode: 'ai' | 'preview'
}

export type WoynuStyleResult = {
  id: string
  createdAt: string
  preferences: WoynuPreferences
  specification: StyleSpecification
  design: GeneratedDesign
}

export type WoynuErrorCode =
  | 'invalid_input'
  | 'payload_too_large'
  | 'method_not_allowed'
  | 'rate_limited'
  | 'timeout'
  | 'content_rejected'
  | 'not_configured'
  | 'generation_failed'

export type WoynuApiResponse =
  | { ok: true; result: WoynuStyleResult }
  | { ok: false; error: { code: WoynuErrorCode; message: string; fields?: Partial<Record<keyof WoynuPreferences, string>> } }

export const MAX_NOTE_LENGTH = 300
export const MAX_ACCESSORIES = 4
