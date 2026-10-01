import {
  accessoryOptions,
  colorOptions,
  heritageThemeOptions,
  labelOf,
  occasionOptions,
  styleOptions,
} from '../../src/woynu-ai/shared/options.js'
import {
  DINGUZA_PALETTE,
  type ColorId,
  type StyleSpecification,
  type WoynuPreferences,
} from '../../src/woynu-ai/shared/types.js'
import { culturalRules, selectRules, type CulturalDesignRule } from './culturalRules.js'

/**
 * Free text is never passed to the image model. It is reduced to descriptors from
 * this allowlist; the original note travels only to the studio with a design request.
 */
const NOTE_DESCRIPTORS: [RegExp, string][] = [
  [/elegan|graceful|ውብ|ቆንጆ/i, 'elegant'],
  [/simple|minimal|clean|ቀላል/i, 'minimal'],
  [/bold|statement|striking/i, 'bold'],
  [/soft|delicate|gentle/i, 'soft'],
  [/flow|drap/i, 'flowing'],
  [/fitted|tailor|slim/i, 'fitted'],
  [/layer/i, 'layered'],
  [/modest|covered|conservative/i, 'modest'],
  [/comfort|relaxed|casual|easy/i, 'comfortable'],
  [/luxur|rich|glam|royal/i, 'luxurious'],
  [/colou?rful|vibrant|bright/i, 'vibrant'],
  [/long sleeve/i, 'long sleeves'],
  [/short sleeve|sleeveless/i, 'short sleeves'],
  [/festive|celebrat/i, 'festive'],
  [/classic|timeless/i, 'timeless'],
]
const MAX_NOTE_DESCRIPTORS = 4

export function extractStyleNotes(note: string | undefined): string[] {
  if (!note) return []
  const found = NOTE_DESCRIPTORS.filter(([pattern]) => pattern.test(note)).map(([, word]) => word)
  return [...new Set(found)].slice(0, MAX_NOTE_DESCRIPTORS)
}

const colorName = (id: ColorId) => labelOf(colorOptions, id).toLowerCase()

export function paletteText(palette: ColorId[]): string {
  const names = palette.map(colorName)
  if (names.length <= 1) return names[0]
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export type BuiltSpecification = {
  specification: StyleSpecification
  /** Rules used, for the prompt builder */
  rules: CulturalDesignRule[]
}

/** Turns validated preferences into a structured design brief using the cultural design layer. */
export function buildStyleSpecification(
  prefs: WoynuPreferences,
  rules: CulturalDesignRule[] = culturalRules,
): BuiltSpecification {
  const selected = selectRules(prefs, rules)
  const dinguza = prefs.dinguza === true
  const heritageTheme = prefs.heritageTheme ?? 'none'
  const palette: ColorId[] = dinguza
    ? [...DINGUZA_PALETTE]
    : prefs.secondaryColor
      ? [prefs.primaryColor, prefs.secondaryColor]
      : [prefs.primaryColor]
  const accessories = prefs.accessories.filter((a) => a !== 'none')

  const styleLabel = labelOf(styleOptions, prefs.stylePreference)
  const occasionLabel = prefs.occasion === 'other' ? 'Occasion' : labelOf(occasionOptions, prefs.occasion)
  const themePrefix = heritageTheme === 'none' ? '' : `${labelOf(heritageThemeOptions, heritageTheme)} · `
  const title = `${themePrefix}${styleLabel} ${dinguza ? 'Dinguza ' : ''}${occasionLabel} Style`.replace(
    'Everyday Wear Style',
    'Everyday Style',
  )

  const accessoryText = accessories.length
    ? ` and ${accessories.map((a) => labelOf(accessoryOptions, a).toLowerCase()).join(', ')}`
    : ''
  const summaryByStyle = {
    traditional: `A Wolaita-inspired design concept that stays close to the studio’s traditional garments, in ${paletteText(palette)}${accessoryText}.`,
    modern: `A contemporary fashion concept with Wolaita-inspired woven accents, in ${paletteText(palette)}${accessoryText}.`,
    traditional_modern: `A contemporary cultural fashion concept combining traditional-inspired elements with a modern silhouette, in ${paletteText(palette)}${accessoryText}.`,
  }

  const themeSentence =
    heritageTheme === 'none' ? '' : ` ${heritageThemeOptions.find((t) => t.id === heritageTheme)?.description?.en ?? ''}`
  const fabricSentence = dinguza ? ' Woven as Wolaita Dinguza cloth.' : ''

  const garmentRules = selected.filter((r) => ['fabric', 'garment', 'modern_interpretation'].includes(r.category))
  const clothingConcept = garmentRules.length
    ? garmentRules.map((r) => r.name).join(' · ')
    : 'A garment concept shaped by your chosen style and occasion'

  const designInspiration = selected
    .filter((r) => r.category !== 'occasion')
    .map((r) =>
      r.source === 'woynu_observed'
        ? `${r.name} (from Woynu Malala\u2019s published garments)`
        : r.category === 'heritage_theme'
          ? `${r.name} (heritage theme, design interpretation)`
          : r.name,
    )

  return {
    specification: {
      title,
      summary: `${summaryByStyle[prefs.stylePreference]}${fabricSentence}${themeSentence}`,
      occasion: prefs.occasion,
      stylePreference: prefs.stylePreference,
      dinguza,
      heritageTheme,
      palette,
      accessories: prefs.accessories,
      clothingConcept,
      designInspiration,
      styleNotes: extractStyleNotes(prefs.additionalPreferences),
      isInspirationConcept: true,
    },
    rules: selected,
  }
}
