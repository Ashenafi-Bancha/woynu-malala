import { slot } from './images'
import type { MediaAsset } from './types'

const CAPTION = 'Photography — Client Asset Needed'

export function media(
  src: string,
  alt: string,
  tone: MediaAsset['tone'] = 'ink',
): MediaAsset {
  return {
    src,
    alt: `${alt} (placeholder photography)`,
    placeholder: true,
    caption: CAPTION,
    tone,
  }
}

/** Real Woynu Malala photography (small previews saved from the Facebook page). */
export function photo(src: string, alt: string, tone: MediaAsset['tone'] = 'earth'): MediaAsset {
  return { src, alt, placeholder: false, caption: '', tone, lowRes: true }
}

export const fbPhotos = {
  couple: photo('/photos/facebook/fb-01.jpg', 'A couple outdoors in matching red, white, and black Wolaita garments'),
  couplePark: photo('/photos/facebook/fb-02.jpg', 'A couple in coordinated Wolaita cultural outfits beside a garden', 'moss'),
  studioFour: photo('/photos/facebook/fb-03.jpg', 'Four women in white dresses with red woven bodices inside the Woynu Malala studio'),
  studioTwo: photo('/photos/facebook/fb-04.jpg', 'Two women in white and red Wolaita dresses in the studio showroom', 'ivory'),
  groupEvent: photo('/photos/facebook/fb-05.jpg', 'A large group of women in matching Wolaita dresses at an outdoor event', 'moss'),
  groupTrees: photo('/photos/facebook/fb-06.jpg', 'A group of women in white and red cultural dresses among trees', 'moss'),
  evening: photo('/photos/facebook/fb-07.jpg', 'A woman in a Wolaita dress holding a shopping bag at an evening venue', 'ink'),
  monument: photo('/photos/facebook/fb-08.jpg', 'A group in Wolaita dresses in front of a lit monument at night', 'ink'),
}

/**
 * Texture and environment stills only. These are not presented as
 * Woynu Malala garments, models, or customers.
 */
export const shots = {
  hero: media(
    '/hero-bg.jpg',
    'Ethiopian-inspired cultural interior design with warm earthy tones and traditional decor',
    'earth',
  ),
  intro: media(
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1800&q=80',
    'Folded cloth in earth tones',
    'earth',
  ),
  gold: media(
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
    'Gold metal detail in low light',
    'gold',
  ),
  landscape: media(
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=2000&q=80',
    'Highland landscape at dusk',
    'moss',
  ),
  weave: media(
    'https://images.unsplash.com/photo-1459501462159-c8f3f1c2c0a0?auto=format&fit=crop&w=1600&q=80',
    'Close weave of natural fiber',
    'ivory',
  ),
  thread: media(
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    'Hanging garments as studio still life, not brand inventory',
    'ink',
  ),
  hands: media(
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1600&q=80',
    'Hands at a work table with cloth',
    'earth',
  ),
  scissors: media(
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80',
    'Atelier table with scissors and fabric',
    'ink',
  ),
  linen: media(
    'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1600&q=80',
    'Folded linen stack',
    'ivory',
  ),
  dusk: media(
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80',
    'Open landscape used as cultural atmosphere',
    'moss',
  ),
  ceremony: media(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80',
    'Soft floral still life suggesting celebration',
    'gold',
  ),
  paper: media(
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    'Handwritten notes on paper',
    'ivory',
  ),
  studio: media(
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80',
    'Quiet atelier interior',
    'ink',
  ),
}

/** Stock hero photo (Unsplash, free licence) used until the studio adds images/hero/hero.jpg. */
const heroStock: MediaAsset = {
  src: '/photos/hero-stock.jpg',
  alt: 'A woman in a flowing deep red dress standing in a green forest',
  placeholder: true,
  caption: 'Photo: K Studios / Unsplash',
  tone: 'earth',
}

/**
 * One photo per page section. Save a file under src/assets/images/ with the
 * matching name to replace the default (see the README in that folder).
 */
export const pageImages = {
  hero: slot('hero/hero', heroStock, 'Woynu Malala cultural fashion'),
  homeIntro: slot('home/intro', shots.intro, 'Woynu Malala studio'),
  homeStatement: slot('home/statement', shots.dusk, 'Wolaita landscape'),
  homeCustom: slot('home/custom', shots.scissors, 'Custom design at Woynu Malala'),
  storyHeader: slot('story/header', fbPhotos.studioFour, 'The Woynu Malala studio'),
  cultureHeader: slot('culture/header', fbPhotos.groupTrees, 'Wolaita cultural clothing'),
  craftHeader: slot('craftsmanship/header', fbPhotos.studioTwo, 'Woynu Malala craftsmanship'),
  customPage: slot('custom/custom', shots.hands, 'Custom design at Woynu Malala'),
  contactHeader: slot('contact/header', fbPhotos.studioFour, 'The Woynu Malala studio'),
  woynuAiIntro: slot('woynu-ai/intro', fbPhotos.studioTwo, 'Woynu AI'),
}
