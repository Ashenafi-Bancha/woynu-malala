import type { AgeGroup, Gender, Occasion, StylePreference } from '../../src/woynu-ai/shared/types.js'

/**
 * Woynu Cultural Design Library (v1).
 *
 * The single place where cultural and design knowledge enters Woynu AI. Rules are
 * data, not code, so an admin screen or database can replace this file later
 * without changing the prompt builder.
 *
 * Source levels:
 *  - 'woynu_verified'    confirmed by Woynu Malala designers (none yet)
 *  - 'woynu_observed'    visible in Woynu Malala's own published garments/photos;
 *                        describes what the garments look like, never what they mean
 *  - 'design_direction'  general fashion craft (silhouette, finish), no cultural claim
 *  - 'placeholder'       structure waiting for designer input; never sent to the AI
 *
 * Do not add cultural meanings, symbolism, history, or "rules" here unless they are
 * verified by Woynu Malala.
 */

export type RuleCategory =
  | 'garment'
  | 'design_element'
  | 'pattern'
  | 'modern_interpretation'
  | 'accessory'
  | 'color_combination'
  | 'occasion'
  | 'cultural_note'
  | 'reference'

export type RuleSource = 'woynu_verified' | 'woynu_observed' | 'design_direction' | 'placeholder'

export interface CulturalDesignRule {
  id: string
  category: RuleCategory
  name: string
  description: string
  /** Visual wording used in the image prompt. Omit for rules that must not reach the AI. */
  promptHint?: string
  applicableStyles?: StylePreference[]
  applicableOccasions?: Occasion[]
  applicableGenders?: Gender[]
  applicableAgeGroups?: AgeGroup[]
  /** Path to an approved reference image (for future image-guided generation) */
  imageReference?: string
  source: RuleSource
  verified: boolean
}

export const culturalRules: CulturalDesignRule[] = [
  // --- Observed in Woynu Malala's own published photos (visual description only) ---
  {
    id: 'ref-studio-signature',
    category: 'reference',
    name: 'Woynu Malala studio signature',
    description:
      'White base garments with red woven panels and narrow vertical striped bands, as seen in the studio’s published photos.',
    promptHint:
      'a white base fabric with rich red woven panels and narrow vertical woven stripe bands, in the visual signature of the Woynu Malala studio',
    applicableStyles: ['traditional', 'traditional_modern'],
    imageReference: '/photos/facebook/fb-03.jpg',
    source: 'woynu_observed',
    verified: false,
  },
  {
    id: 'garment-long-dress',
    category: 'garment',
    name: 'Long dress with woven bodice',
    description: 'Floor-length white dress with a red woven bodice and a vertical woven band down the skirt.',
    promptHint: 'a floor-length dress with a fitted woven bodice and a vertical woven band running down the skirt',
    applicableStyles: ['traditional', 'traditional_modern'],
    applicableGenders: ['female', 'unspecified'],
    imageReference: '/photos/facebook/fb-04.jpg',
    source: 'woynu_observed',
    verified: false,
  },
  {
    id: 'garment-shirt-sash',
    category: 'garment',
    name: 'Shirt with woven sash',
    description: 'White shirt worn with a striped woven sash over the shoulders and patterned trousers.',
    promptHint: 'a tailored white shirt with a striped woven sash draped over the shoulders, paired with trousers carrying a woven pattern band',
    applicableStyles: ['traditional', 'traditional_modern'],
    applicableGenders: ['male', 'unspecified'],
    imageReference: '/photos/facebook/fb-01.jpg',
    source: 'woynu_observed',
    verified: false,
  },
  {
    id: 'element-woven-trim',
    category: 'design_element',
    name: 'Woven trim on sleeves and hems',
    description: 'Striped woven trim at cuffs, hems, and necklines.',
    promptHint: 'striped woven trim at the cuffs, hem, and neckline',
    source: 'woynu_observed',
    verified: false,
  },

  // --- General design direction (no cultural claims) ---
  {
    id: 'modern-tailored',
    category: 'modern_interpretation',
    name: 'Contemporary tailored silhouette',
    description: 'Clean contemporary cut with cultural woven details used as accents.',
    promptHint: 'a clean contemporary tailored silhouette where the woven details appear as refined accents',
    applicableStyles: ['modern', 'traditional_modern'],
    source: 'design_direction',
    verified: false,
  },
  {
    id: 'modern-statement-panel',
    category: 'modern_interpretation',
    name: 'Statement woven panel',
    description: 'A single bold woven panel as the focal point of an otherwise minimal garment.',
    promptHint: 'one bold woven panel as the focal point of an otherwise minimal garment',
    applicableStyles: ['modern'],
    source: 'design_direction',
    verified: false,
  },
  {
    id: 'occasion-formal-finish',
    category: 'occasion',
    name: 'Ceremonial finish',
    description: 'Elevated fabrics and careful finishing for ceremonies.',
    promptHint: 'an elevated ceremonial finish with fine fabric and careful detailing',
    applicableOccasions: ['wedding', 'gifaataa', 'cultural_celebration', 'formal_event'],
    source: 'design_direction',
    verified: false,
  },
  {
    id: 'occasion-relaxed-finish',
    category: 'occasion',
    name: 'Comfortable everyday finish',
    description: 'Breathable fabric and easy movement for daily wear.',
    promptHint: 'breathable fabric and an easy, comfortable fit for daily wear',
    applicableOccasions: ['everyday', 'family_celebration', 'festival'],
    source: 'design_direction',
    verified: false,
  },

  // --- Placeholders for Woynu Malala designers (never sent to the AI) ---
  {
    id: 'pattern-names',
    category: 'pattern',
    name: '[Pattern names and motifs — Woynu Malala designers to provide]',
    description: 'Names, construction, and approved use of the studio’s woven patterns.',
    source: 'placeholder',
    verified: false,
  },
  {
    id: 'accessory-traditional',
    category: 'accessory',
    name: '[Traditional accessory references — Woynu Malala designers to provide]',
    description: 'Approved jewellery and accessory references with images.',
    source: 'placeholder',
    verified: false,
  },
  {
    id: 'color-meanings',
    category: 'color_combination',
    name: '[Colour combinations and any meanings — Woynu Malala designers to provide]',
    description: 'Only verified meanings may be recorded here.',
    source: 'placeholder',
    verified: false,
  },
  {
    id: 'age-guidance',
    category: 'cultural_note',
    name: '[Age-specific guidance — Woynu Malala designers to provide]',
    description: 'Any customary differences in dress for children, young adults, adults, and elders.',
    source: 'placeholder',
    verified: false,
  },
]

type RuleQuery = {
  stylePreference: StylePreference
  occasion: Occasion
  gender: Gender
  ageGroup: AgeGroup
}

const matches = <T>(list: T[] | undefined, value: T) => !list || list.includes(value)

/** Rules that apply to this request and may be used in a prompt (placeholders excluded). */
export function selectRules(query: RuleQuery, rules: CulturalDesignRule[] = culturalRules): CulturalDesignRule[] {
  return rules.filter(
    (r) =>
      r.source !== 'placeholder' &&
      Boolean(r.promptHint) &&
      matches(r.applicableStyles, query.stylePreference) &&
      matches(r.applicableOccasions, query.occasion) &&
      matches(r.applicableGenders, query.gender) &&
      matches(r.applicableAgeGroups, query.ageGroup),
  )
}
