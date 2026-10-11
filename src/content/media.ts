import { slot } from './images'
import type { MediaAsset } from './types'

/**
 * The studio's own photos, saved from the Woynu Malala Facebook page at full size, then
 * cropped and compressed (public/photos/studio). No stock or placeholder images are used.
 */
function studio(name: string, alt: string, tone: MediaAsset['tone'] = 'earth'): MediaAsset {
  return { src: `/photos/studio/${name}.webp`, alt, placeholder: false, caption: '', tone }
}

const library = {
  studio: studio('studio', 'A woman in the Woynu Malala studio wearing a white dress with a Dinguza skirt', 'ivory'),
  studioFlare: studio('studio-flare', 'A woman in the Woynu Malala studio spreading the skirt of a white and Dinguza dress', 'ivory'),
  mirror: studio('mirror', 'A customer in a white dress with a Dinguza skirt at the studio mirror', 'ivory'),
  shopfront: studio('shopfront', 'The Woynu Malala shop front with dresses displayed on mannequins'),
  mannequins: studio('mannequins', 'White dresses with Dinguza bands and scarves displayed on mannequins', 'ivory'),
  sign: studio('sign', 'A woman seated in front of the Woynu Malala shop sign', 'ivory'),
  couple: studio('couple', 'A couple in white garments with Dinguza trim, holding a Dinguza bag', 'moss'),
  bag: studio('bag', 'A handbag woven in the Dinguza pattern'),
  family: studio('family', 'A family in white and Dinguza clothing in a field of yellow flowers', 'moss'),
  headwrap: studio('headwrap', 'A woman in a white dress with a Dinguza headwrap and scarf'),
  redDress: studio('red-dress', 'A woman in a red dress with a Dinguza wrap and headwrap, seated by a tree', 'ink'),
  event: studio('event', 'A woman in a white dress with Dinguza trim at a venue decorated with flowers and leaves', 'gold'),
  line: studio('line', 'A long line of women in white dresses with Dinguza sashes at an outdoor celebration', 'moss'),
  lineWide: studio('line-wide', 'Women in white dresses with Dinguza sashes at an outdoor celebration', 'moss'),
  elders: studio('elders', 'Elders in Dinguza suits and white shawls holding staffs', 'ivory'),
  men: studio('men', 'Men in Dinguza suits and hats standing in a row outdoors', 'moss'),
  skirt: studio('skirt', 'Close view of a Dinguza skirt in red, black and yellow bands'),
}

/** Photos of people wearing the studio's work. (Names are kept from the first version of the site.) */
export const fbPhotos = {
  couple: library.couple,
  couplePark: library.family,
  studioFour: library.studioFlare,
  studioTwo: library.mirror,
  groupEvent: library.line,
  groupTrees: library.family,
  evening: library.redDress,
  monument: library.headwrap,
}

/** Studio, shop and detail photos. (These names once pointed at stock images; all are real photos now.) */
export const shots = {
  hero: library.lineWide,
  intro: library.studio,
  gold: library.mannequins,
  landscape: library.lineWide,
  weave: library.skirt,
  thread: library.mannequins,
  hands: library.mirror,
  scissors: library.shopfront,
  linen: library.bag,
  dusk: library.lineWide,
  ceremony: library.event,
  paper: library.sign,
  studio: library.studioFlare,
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
  storyBanner: slot('story/banner', shots.landscape, 'Wolaita landscape'),
  cultureHeader: slot('culture/header', fbPhotos.groupTrees, 'Wolaita cultural clothing'),
  craftHeader: slot('craftsmanship/header', fbPhotos.studioTwo, 'Woynu Malala craftsmanship'),
  customPage: slot('custom/custom', shots.hands, 'Custom design at Woynu Malala'),
  contactHeader: slot('contact/header', fbPhotos.studioFour, 'The Woynu Malala studio'),
  woynuAiIntro: slot('woynu-ai/intro', fbPhotos.studioTwo, 'Woynu AI'),
}
