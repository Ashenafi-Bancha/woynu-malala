import { labelOf, occasionOptions } from '../../src/woynu-ai/shared/options.js'
import type { Accessory, StyleSpecification, WoynuPreferences } from '../../src/woynu-ai/shared/types.js'
import type { CulturalDesignRule } from './culturalRules.js'
import { paletteText } from './designSpec.js'

// Builds the image prompt from the structured brief only. Visitors never control
// the prompt text: every phrase below comes from fixed templates or the cultural rules.

const SUBJECT: Record<WoynuPreferences['ageGroup'], Record<WoynuPreferences['gender'], string>> = {
  child: { female: 'a young girl of about eight', male: 'a young boy of about eight', unspecified: 'a child of about eight' },
  teen: { female: 'a teenage girl', male: 'a teenage boy', unspecified: 'a teenager' },
  young_adult: { female: 'a young woman in her twenties', male: 'a young man in his twenties', unspecified: 'a young adult in their twenties' },
  adult: { female: 'a woman in her forties', male: 'a man in his forties', unspecified: 'an adult in their forties' },
  elder: { female: 'a dignified elder woman in her sixties', male: 'a dignified elder man in his sixties', unspecified: 'a dignified elder in their sixties' },
}

const STYLE_DIRECTION: Record<WoynuPreferences['stylePreference'], string> = {
  traditional:
    'stay close to traditional Wolaita-inspired dress as described by the garment details below, with classic proportions and minimal modern alteration',
  modern: 'contemporary fashion design in which Wolaita-inspired woven details appear as accents on a modern silhouette',
  traditional_modern:
    'a contemporary interpretation in which traditional-inspired woven elements meet a modern, refined silhouette',
}

const ACCESSORY_PHRASE: Record<Exclude<Accessory, 'none'>, string> = {
  traditional_jewelry: 'refined traditional-style jewellery',
  necklace: 'a necklace',
  bracelet: 'a bracelet',
  head_accessory: 'a simple head accessory',
  cultural_accessory: 'a small woven accessory such as a shawl or bag in the same palette',
}

const OCCASION_PHRASE: Partial<Record<WoynuPreferences['occasion'], string>> = {
  gifaataa: 'Gifaataa, the Wolaita New Year celebration',
  everyday: 'everyday wear',
  other: 'a special occasion',
}

const hintsFor = (rules: CulturalDesignRule[], categories: CulturalDesignRule['category'][]) =>
  rules.filter((r) => categories.includes(r.category) && r.promptHint).map((r) => r.promptHint as string)

export function buildWoynuStylePrompt(
  prefs: WoynuPreferences,
  spec: StyleSpecification,
  rules: CulturalDesignRule[],
): string {
  const subject = SUBJECT[prefs.ageGroup][prefs.gender]
  const occasion = OCCASION_PHRASE[prefs.occasion] ?? `a ${labelOf(occasionOptions, prefs.occasion).toLowerCase()}`
  const garments = hintsFor(rules, ['reference', 'garment', 'modern_interpretation'])
  const details = hintsFor(rules, ['design_element'])
  const finish = hintsFor(rules, ['occasion'])
  const accessories = prefs.accessories.filter((a): a is Exclude<Accessory, 'none'> => a !== 'none')
  const young = prefs.ageGroup === 'child' || prefs.ageGroup === 'teen'

  const lines = [
    'Fashion design concept image for Woynu Malala, a cultural clothing and décor studio in Wolaita Sodo, Ethiopia.',
    `Create a full-length editorial fashion photograph of ${subject} wearing a Wolaita-inspired outfit designed for ${occasion}.`,
    `Style direction: ${STYLE_DIRECTION[prefs.stylePreference]}.`,
    garments.length ? `Garment: ${garments.join('; ')}.` : '',
    details.length ? `Details: ${details.join('; ')}.` : '',
    finish.length ? `Finish: ${finish.join('; ')}.` : '',
    `Colour palette: ${paletteText(spec.palette)}${spec.palette.length === 2 ? ', with the first colour dominant' : ''}. Use only these garment colours.`,
    accessories.length
      ? `Accessories: ${accessories.map((a) => ACCESSORY_PHRASE[a]).join(', ')}, kept tasteful and secondary to the garment.`
      : 'Accessories: none; let the garment stand on its own.',
    spec.styleNotes.length ? `Styling notes: ${spec.styleNotes.join(', ')}.` : '',
    young ? 'The outfit must be age-appropriate, modest, and comfortable for a young person.' : '',
    'Composition: one person, full body visible from head to toe, natural and dignified pose, soft natural light, plain warm neutral studio backdrop, sharp focus on fabric texture, weave, and stitching, high-end fashion lookbook quality.',
    'Cultural guidance: a respectful, contemporary portrayal of an Ethiopian person from Wolaita. Base the outfit only on the garment details above. Do not add clothing, headwear, or motifs from other Ethiopian regions or other cultures, avoid generic "African costume" clichés, face paint, and stereotypes.',
    'Do not include any text, logos, watermarks, or captions.',
  ]
  return lines.filter(Boolean).join('\n')
}
