import type { AgeGroup, Gender, HeritageTheme, Occasion, StylePreference } from '../../src/woynu-ai/shared/types.js'

/**
 * Woynu Cultural Design Library (v1).
 *
 * The single place where cultural and design knowledge enters Woynu AI. Rules are
 * data, not code, so an admin screen or database can replace this file later
 * without changing the prompt builder.
 *
 * Source levels:
 *  - 'woynu_verified'    confirmed by Woynu Malala designers (none yet)
 *  - 'woynu_stated'      told to us by Woynu Malala (e.g. Dinguza colours, heritage themes);
 *                        awaiting designer detail and reference photos
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
  | 'fabric'
  | 'heritage_theme'
  | 'design_element'
  | 'pattern'
  | 'modern_interpretation'
  | 'accessory'
  | 'color_combination'
  | 'occasion'
  | 'cultural_note'
  | 'reference'

export type RuleSource = 'woynu_verified' | 'woynu_stated' | 'woynu_observed' | 'design_direction' | 'placeholder'

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
  /** Only used when the visitor picks one of these heritage themes */
  applicableThemes?: HeritageTheme[]
  /** true: only with Dinguza; false: never with Dinguza; omitted: either */
  dinguza?: boolean
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
    dinguza: false,
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

  // --- Stated by Woynu Malala: Dinguza and heritage themes ---
  {
    id: 'fabric-dinguza',
    category: 'fabric',
    name: 'Dinguza woven cloth',
    description:
      'Wolaita Dinguza cloth in red, black, and yellow (colours as stated by Woynu Malala). Stripe order, proportions, and reference photos to be supplied by the designers.',
    promptHint:
      'made from Wolaita Dinguza woven cloth: bold woven stripes in red, black, and yellow only, with a visible handwoven texture',
    dinguza: true,
    source: 'woynu_stated',
    verified: false,
  },
  {
    id: 'theme-land-of-kings',
    category: 'heritage_theme',
    name: 'Land of Kings',
    description:
      'Heritage statement from Woynu Malala: Wolaita is the land of 50+ kings. Design interpretation (to be verified): a regal, ceremonial presence.',
    promptHint:
      'a regal, stately presence: a long layered silhouette with a draped shoulder cloth and rich, dense weaving, worn with dignity',
    applicableThemes: ['land_of_kings'],
    source: 'design_direction',
    verified: false,
  },
  {
    id: 'theme-seven-gates',
    category: 'heritage_theme',
    name: 'Seven Gates',
    description:
      'Heritage statement from Woynu Malala: there are seven gates to Wolaita Sodo town. Design interpretation (to be verified): a motif of seven.',
    promptHint: 'a motif of seven: exactly seven bold woven bands or panels arranged in a steady rhythm across the garment',
    applicableThemes: ['seven_gates'],
    source: 'design_direction',
    verified: false,
  },
  {
    id: 'theme-warrior-heritage',
    category: 'heritage_theme',
    name: 'Warrior Heritage',
    description:
      'Heritage statement from Woynu Malala: Wolaita\u2019s history of war and courage. Design interpretation (to be verified): strength expressed through cut and contrast, never through weapons.',
    promptHint:
      'strength and courage expressed through the cut: a strong structured silhouette with defined shoulders, a firmly wrapped waist, and bold high-contrast stripes',
    applicableThemes: ['warrior_heritage'],
    source: 'design_direction',
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
    id: 'dinguza-styles',
    category: 'fabric',
    name: '[Historical Dinguza styles: names, periods, stripe layouts, reference photos. Woynu Malala designers to provide]',
    description: 'One entry per historical style once verified, each with approved reference images.',
    source: 'placeholder',
    verified: false,
  },
  {
    id: 'heritage-history',
    category: 'heritage_theme',
    name: '[Heritage history details: kings, the seven gates, war history. Woynu Malala or cultural experts to provide]',
    description: 'Verified text and approved visual symbols for each heritage theme.',
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
  heritageTheme?: HeritageTheme
  dinguza?: boolean
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
      matches(r.applicableAgeGroups, query.ageGroup) &&
      // Theme rules apply only when that theme is chosen
      (!r.applicableThemes || (query.heritageTheme !== undefined && r.applicableThemes.includes(query.heritageTheme))) &&
      (r.dinguza === undefined || r.dinguza === Boolean(query.dinguza)),
  )
}
