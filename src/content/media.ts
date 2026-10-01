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
    '/photos/stock/intro.webp',
    'Folded cloth in earth tones',
    'earth',
  ),
  gold: media(
    '/photos/stock/gold.webp',
    'Gold metal detail in low light',
    'gold',
  ),
  landscape: media(
    '/photos/stock/landscape.webp',
    'Highland landscape at dusk',
    'moss',
  ),
  weave: media(
    '/photos/stock/linen.webp',
    'Close weave of natural fiber',
    'ivory',
  ),
  thread: media(
    '/photos/stock/thread.webp',
    'Hanging garments as studio still life, not brand inventory',
    'ink',
  ),
  hands: media(
    '/photos/stock/hands.webp',
    'Hands at a work table with cloth',
    'earth',
  ),
  scissors: media(
    '/photos/stock/scissors.webp',
    'Atelier table with scissors and fabric',
    'ink',
  ),
  linen: media(
    '/photos/stock/linen.webp',
    'Folded linen stack',
    'ivory',
  ),
  dusk: media(
    '/photos/stock/dusk.webp',
    'Open landscape used as cultural atmosphere',
    'moss',
  ),
  ceremony: media(
    '/photos/stock/ceremony.webp',
    'Soft floral still life suggesting celebration',
    'gold',
  ),
  paper: media(
    '/photos/stock/paper.webp',
    'Handwritten notes on paper',
    'ivory',
  ),
  studio: media(
    '/photos/stock/studio.webp',
    'Quiet atelier interior',
    'ink',
  ),
}

/**
 * One photo per page section. Save a file under src/assets/images/ with the
 * matching name to replace the default (see the README in that folder).
 */
export const pageImages = {
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
