import type { DesignRequestPrefill } from '../components/CustomDesignForm'
import {
  accessoryOptions,
  colorOptions,
  heritageThemeOptions,
  labelOf,
  occasionOptions,
  styleOptions,
} from './shared/options'
import type { WoynuStyleResult } from './shared/types'

/**
 * Converts a Woynu AI result into the existing custom-design request, in English for
 * the studio, so the visitor doesn't re-enter their choices.
 */
export function toDesignRequestPrefill(result: WoynuStyleResult): DesignRequestPrefill {
  const { preferences: p, specification: s } = result
  const gender: DesignRequestPrefill['gender'] =
    p.ageGroup === 'child' ? 'Child' : p.gender === 'female' ? 'Woman' : p.gender === 'male' ? 'Man' : 'Prefer not to say'
  const accessories = p.accessories.filter((a) => a !== 'none').map((a) => labelOf(accessoryOptions, a))

  const description = [
    `Woynu AI concept: ${s.title}.`,
    s.summary,
    `Clothing concept: ${s.clothingConcept}.`,
    s.dinguza ? 'Cloth: Dinguza (red, black, yellow).' : '',
    s.heritageTheme && s.heritageTheme !== 'none' ? `Heritage theme: ${labelOf(heritageThemeOptions, s.heritageTheme)}.` : '',
    `Accessories: ${accessories.length ? accessories.join(', ') : 'none'}.`,
    p.additionalPreferences ? `My notes: ${p.additionalPreferences}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    gender,
    occasion: labelOf(occasionOptions, p.occasion),
    preferredStyle: labelOf(styleOptions, p.stylePreference),
    preferredColors: s.palette.map((c) => labelOf(colorOptions, c)).join(', '),
    description,
    // The image itself is not stored (size/privacy); the studio gets the full brief.
    woynuAiConcept: JSON.stringify({
      id: result.id,
      createdAt: result.createdAt,
      title: s.title,
      preferences: p,
      provider: result.design.provider,
      mode: result.design.mode,
    }),
  }
}
