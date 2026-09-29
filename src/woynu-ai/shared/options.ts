import type { Accessory, AgeGroup, ColorId, Gender, Occasion, StylePreference } from './types.js'

// Display options for Woynu AI, in English and Amharic. The server uses the English
// labels when writing the design brief. Colour entries carry no cultural meanings:
// meanings may only be added once verified by Woynu Malala.

export type Localized = { en: string; am: string }

export type Option<T extends string> = {
  id: T
  label: Localized
  description?: Localized
}

export const genderOptions: Option<Gender>[] = [
  { id: 'female', label: { en: 'Female', am: 'ሴት' } },
  { id: 'male', label: { en: 'Male', am: 'ወንድ' } },
  { id: 'unspecified', label: { en: 'Prefer not to specify', am: 'መግለጽ አልፈልግም' } },
]

export const ageGroupOptions: Option<AgeGroup>[] = [
  { id: 'child', label: { en: 'Child', am: 'ልጅ' } },
  { id: 'teen', label: { en: 'Teen', am: 'ታዳጊ' } },
  { id: 'young_adult', label: { en: 'Young Adult', am: 'ወጣት' } },
  { id: 'adult', label: { en: 'Adult', am: 'አዋቂ' } },
  { id: 'elder', label: { en: 'Elder', am: 'አዛውንት' } },
]

export const occasionOptions: Option<Occasion>[] = [
  {
    id: 'wedding',
    label: { en: 'Wedding', am: 'ሠርግ' },
    description: { en: 'For the couple, family, or guests', am: 'ለሙሽሮች፣ ለቤተሰብ ወይም ለእንግዶች' },
  },
  {
    id: 'gifaataa',
    label: { en: 'Gifaataa', am: 'ጊፋታ' },
    description: { en: 'Wolaita New Year celebration', am: 'የወላይታ አዲስ ዓመት በዓል' },
  },
  {
    id: 'cultural_celebration',
    label: { en: 'Cultural Celebration', am: 'ባህላዊ በዓል' },
    description: { en: 'Community and heritage events', am: 'የማኅበረሰብ እና የቅርስ ዝግጅቶች' },
  },
  {
    id: 'festival',
    label: { en: 'Festival', am: 'ፌስቲቫል' },
    description: { en: 'Music, dance, and open-air days', am: 'ሙዚቃ፣ ጭፈራ እና የአደባባይ ቀናት' },
  },
  {
    id: 'formal_event',
    label: { en: 'Formal Event', am: 'መደበኛ ዝግጅት' },
    description: { en: 'Ceremonies, galas, and receptions', am: 'ሥነ ሥርዓቶች እና የእራት ግብዣዎች' },
  },
  {
    id: 'family_celebration',
    label: { en: 'Family Celebration', am: 'የቤተሰብ በዓል' },
    description: { en: 'Gatherings with the people closest to you', am: 'ከቅርብ ሰዎችዎ ጋር የሚደረጉ ስብሰባዎች' },
  },
  {
    id: 'everyday',
    label: { en: 'Everyday Wear', am: 'የዕለት ልብስ' },
    description: { en: 'Comfortable heritage for daily life', am: 'ለዕለት ተዕለት ኑሮ የሚመች ቅርስ' },
  },
  {
    id: 'other',
    label: { en: 'Other', am: 'ሌላ' },
    description: { en: 'Tell us more in the last step', am: 'በመጨረሻው ደረጃ ተጨማሪ ይንገሩን' },
  },
]

export const styleOptions: Option<StylePreference>[] = [
  {
    id: 'traditional',
    label: { en: 'Traditional', am: 'ባህላዊ' },
    description: {
      en: 'Inspired strongly by traditional Wolaita cultural clothing.',
      am: 'በባህላዊ የወላይታ አልባሳት በጥልቀት የተነሳሳ።',
    },
  },
  {
    id: 'modern',
    label: { en: 'Modern', am: 'ዘመናዊ' },
    description: {
      en: 'Contemporary fashion influenced by cultural elements.',
      am: 'በባህላዊ ገጽታዎች የተቃኘ ዘመናዊ ፋሽን።',
    },
  },
  {
    id: 'traditional_modern',
    label: { en: 'Traditional + Modern', am: 'ባህላዊ + ዘመናዊ' },
    description: {
      en: 'A contemporary interpretation of Wolaita cultural fashion.',
      am: 'የወላይታ ባህላዊ ፋሽን ዘመናዊ ትርጓሜ።',
    },
  },
]

export type ColorOption = Option<ColorId> & { hex: string }

/** Curated palette that sits well with the Woynu Malala brand and the studio's garments. */
export const colorOptions: ColorOption[] = [
  { id: 'white', label: { en: 'White', am: 'ነጭ' }, hex: '#F5F2EC' },
  { id: 'red', label: { en: 'Red', am: 'ቀይ' }, hex: '#B3261E' },
  { id: 'black', label: { en: 'Black', am: 'ጥቁር' }, hex: '#141111' },
  { id: 'amber', label: { en: 'Amber Gold', am: 'ወርቃማ' }, hex: '#DEA052' },
  { id: 'yellow', label: { en: 'Yellow', am: 'ቢጫ' }, hex: '#E8C33A' },
  { id: 'maroon', label: { en: 'Maroon', am: 'ደማቅ ቀይ' }, hex: '#6E1F24' },
  { id: 'earth', label: { en: 'Earth Brown', am: 'ቡናማ' }, hex: '#7A5436' },
  { id: 'green', label: { en: 'Forest Green', am: 'አረንጓዴ' }, hex: '#2F5D3A' },
]

export const accessoryOptions: Option<Accessory>[] = [
  { id: 'traditional_jewelry', label: { en: 'Traditional jewelry', am: 'ባህላዊ ጌጣጌጥ' } },
  { id: 'necklace', label: { en: 'Necklace', am: 'የአንገት ሐብል' } },
  { id: 'bracelet', label: { en: 'Bracelet', am: 'አምባር' } },
  { id: 'head_accessory', label: { en: 'Head accessories', am: 'የራስ ጌጥ' } },
  { id: 'cultural_accessory', label: { en: 'Cultural accessories', am: 'ባህላዊ መለዋወጫዎች' } },
  { id: 'none', label: { en: 'No accessories', am: 'ያለ ጌጣጌጥ' } },
]

/** Looks up an option's label in the requested language. */
export function labelOf<T extends string>(options: Option<T>[], id: T, lang: 'en' | 'am' = 'en'): string {
  return options.find((o) => o.id === id)?.label[lang] ?? id
}

export const colorHex = (id: ColorId) => colorOptions.find((c) => c.id === id)?.hex ?? '#888888'
