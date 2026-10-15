import { showWoynuAi } from '../lib/features'
import { imageFor, pad2, slot, slugify } from './images'
import { fbPhotos, shots } from './media'
import type {
  Collection,
  CraftStep,
  CultureTopic,
  JournalPost,
  Look,
  Occasion,
} from './types'

export const brand = {
  name: 'Woynu Malala Cultural Cloth Design and Decor',
  shortName: 'Woynu Malala',
  descriptor: 'Cultural Cloth Design and Decor',
  // Official name and slogan as used on the studio's Facebook page
  amharicName: 'ወይኑ/ማላላ ባህላዊ አልባሳት ዲዛይን እና ዲኮር',
  amharicSlogan: 'ወይኑ ማላላ — ባህላችንን በውበት!',
  sloganTranslation: 'Our culture, in beauty.',
  location: 'Wolaita Sodo, Ethiopia',
  facebookFollowers: '24K',
  tagline: 'Wolaita Heritage. Reimagined.',
  statement: 'Traditional Wolaita identity transformed into contemporary fashion.',
  siteUrl: 'https://woynu-malala.vercel.app',
}

const allNav = [
  { to: '/', label: 'Home' },
  { to: '/collections', label: 'Collections' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/story', label: 'Our Story' },
  { to: '/culture', label: 'Culture' },
  { to: '/custom', label: 'Custom' },
  { to: '/woynu-ai', label: 'Woynu AI' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

/** The menu. Woynu AI is left out on the public site until it is ready (see lib/features.ts). */
export const nav = allNav.filter((item) => showWoynuAi || item.to !== '/woynu-ai')

export const footerNav = [
  ...nav,
  { to: '/order', label: 'Order' },
  { to: '/craftsmanship', label: 'Craftsmanship' },
]

export const social = {
  instagram: { href: '#', label: 'Instagram', pending: 'Coming soon' },
  facebook: { href: 'https://www.facebook.com/profile.php?id=100082906343810', label: 'Facebook', pending: '' },
  tiktok: { href: '#', label: 'TikTok', pending: 'Coming soon' },
  whatsapp: { href: 'https://wa.me/251923400278', label: 'WhatsApp', pending: '' },
  telegram: { href: '#', label: 'Telegram', pending: 'Telegram is coming soon' },
  phone: { href: 'tel:+251923400278', label: 'Call', pending: '' },
  studio: {
    href: 'https://www.google.com/maps/search/?api=1&query=Wolaita+Sodo%2C+Ethiopia',
    label: 'Visit Studio',
    pending: 'Call or message us for directions to the studio.',
  },
}

/** Studio phone, shown locally formatted; the same number is used for calls and WhatsApp. */
/** PLACEHOLDER: replace with the studio's real opening hours. */
export const openingHours = 'Call or message us for today’s opening hours.'

/** Map of Wolaita Sodo town (OpenStreetMap). No marker: the exact studio location is not yet confirmed. */
export const mapEmbedUrl =
  'https://www.openstreetmap.org/export/embed.html?bbox=37.730%2C6.830%2C37.790%2C6.880&layer=mapnik'

export const phoneDisplay = '0923 400 278'
export const phoneInternational = '+251 923 400 278'

export const collections: Collection[] = [
  {
    id: 'c1',
    slug: 'wolaita-heritage',
    title: 'Wolaita Heritage',
    kicker: 'Collection 01',
    intro:
      'Our signature collection: white dresses and suits finished with Dinguza, the cloth of Wolaita woven in bands of red, black and yellow.',
    published: true,
    featured: true,
    cover: fbPhotos.groupEvent,
    designs: [
      {
        id: 'd1',
        name: 'Heritage drape',
        description: 'White dresses and head coverings worn with a Dinguza wrap across the shoulder.',
        culturalNote: 'Made with Dinguza, the Wolaita cloth of red, black and yellow bands.',
        images: [shots.weave, shots.gold],
        featured: true,
      },
      {
        id: 'd2',
        name: 'Pattern study',
        description: 'Dinguza suits with hats for men, beside a white dress with a Dinguza front.',
        culturalNote: 'Suits like these are often ordered for a whole group.',
        images: [shots.thread],
        featured: false,
      },
      {
        id: 'd3',
        name: 'Ceremonial line',
        description: 'Bold suits and dresses in full Dinguza cloth for a whole family or group.',
        culturalNote: 'Full-cloth outfits show the Dinguza bands from shoulder to hem.',
        images: [shots.linen],
        featured: false,
      },
    ],
  },
  {
    id: 'c2',
    slug: 'modern-wolaita',
    title: 'Modern Wolaita',
    kicker: 'Collection 02',
    intro:
      'Wolaita cloth in today’s shapes: gowns, dresses and shirts you can wear to the office, to church or out in the city.',
    published: true,
    featured: true,
    cover: fbPhotos.evening,
    designs: [
      {
        id: 'd4',
        name: 'City weave',
        description: 'A green woven dress with a Dinguza yoke and waistband, worn with a matching hat.',
        culturalNote: 'A modern cut that keeps the Dinguza bands as the centre of the design.',
        images: [shots.studio],
        featured: true,
      },
      {
        id: 'd5',
        name: 'Soft architecture',
        description: 'A white dress with a striped shawl and a matching hat, easy to wear every day.',
        culturalNote: 'Everyday wear that still carries the Wolaita colours.',
        images: [shots.linen],
        featured: false,
      },
    ],
  },
  {
    id: 'c3',
    slug: 'bridal',
    title: 'Bridal Collection',
    kicker: 'Collection 03',
    intro:
      'Wedding outfits for the bride, the groom and the whole bridal party, designed around the Dinguza colours and made to order.',
    published: true,
    featured: true,
    cover: fbPhotos.couplePark,
    designs: [
      {
        id: 'd6',
        name: 'Vow',
        description: 'A bridal gown in the Dinguza colours with a matching suit for the groom.',
        culturalNote: 'Bride and groom are designed together so the two outfits belong to each other.',
        images: [shots.gold, shots.ceremony],
        featured: true,
      },
    ],
  },
  {
    id: 'c4',
    slug: 'women',
    title: "Women's Collection",
    kicker: 'Collection 04',
    intro: 'Dresses for women of every age, from light everyday pieces to full gowns, each finished with Dinguza trim.',
    published: true,
    featured: true,
    cover: fbPhotos.studioTwo,
    designs: [
      {
        id: 'd7',
        name: 'Lineage',
        description: 'Long white dresses with a Dinguza panel down the front and bands at the cuffs.',
        culturalNote: 'Available in the studio on mannequins, or made to your measurements.',
        images: [shots.intro],
        featured: true,
      },
    ],
  },
  {
    id: 'c5',
    slug: 'men',
    title: "Men's Collection",
    kicker: 'Collection 05',
    intro: 'Shirts, jackets, scarves and hats for men, in white with Dinguza panels or in full Dinguza cloth.',
    published: true,
    featured: true,
    cover: fbPhotos.couple,
    designs: [
      {
        id: 'd8',
        name: 'Ground',
        description: 'A white shirt-jacket with woven panels in red, black and gold on the chest.',
        culturalNote: 'A simple way for men to wear Dinguza without a full suit.',
        images: [shots.dusk],
        featured: true,
      },
    ],
  },
  {
    id: 'c6',
    slug: 'children',
    title: "Children's Collection",
    kicker: 'Collection 06',
    intro: 'Small versions of our outfits for boys and girls, made for holidays, family photos and school events.',
    published: true,
    featured: false,
    cover: shots.weave,
    designs: [
      {
        id: 'd9',
        name: 'First cloth',
        description: 'Dinguza outfits for boys and girls, with matching hats and headbands.',
        culturalNote: 'Made in children’s sizes from the same cloth as the adult pieces.',
        images: [shots.weave],
        featured: false,
      },
    ],
  },
  {
    id: 'c7',
    slug: 'special-occasions',
    title: 'Special Occasions',
    kicker: 'Collection 07',
    intro: 'Matching outfits for families, friends and teams: graduations, holidays, church events and celebrations.',
    published: true,
    featured: true,
    cover: fbPhotos.monument,
    designs: [
      {
        id: 'd10',
        name: 'Evening heritage',
        description: 'White gowns with wide patterned hems, made for celebrations and photographs.',
        culturalNote: 'Hem patterns and colours can be chosen to suit the occasion.',
        images: [shots.gold],
        featured: true,
      },
    ],
  },
  {
    id: 'c8',
    slug: 'custom',
    title: 'Custom Designs',
    kicker: 'Collection 08',
    intro:
      'Made to order from your own idea: tell us the occasion, the colours and the people to dress, and we design it with you.',
    published: true,
    featured: false,
    cover: fbPhotos.studioFour,
    designs: [
      {
        id: 'd11',
        name: 'Commission study',
        description: 'A men’s shirt in a dark woven cloth with patterned panels, made to order.',
        culturalNote: 'Bring an idea or a photo and we will design it with you.',
        images: [shots.paper],
        featured: false,
      },
    ],
  },
]

/** Category filter on the Collections page. A collection can sit in more than one category. */
export const collectionFilters = ['All', 'Women', 'Men', 'Children', 'Occasions', 'Heritage'] as const
export type CollectionFilter = (typeof collectionFilters)[number]

export const collectionCategories: Record<string, CollectionFilter[]> = {
  'wolaita-heritage': ['Heritage'],
  'modern-wolaita': ['Heritage'],
  bridal: ['Women', 'Occasions'],
  women: ['Women'],
  men: ['Men'],
  children: ['Children'],
  'special-occasions': ['Occasions'],
  custom: ['Occasions'],
}

export const looks: Look[] = [
  {
    id: 'l1',
    number: 'LOOK 01',
    title: 'Heritage Pair',
    collectionTitle: 'Heritage',
    note: 'A couple dressed to match: her dress and his scarf carry the same Dinguza.',
    image: fbPhotos.couple,
  },
  {
    id: 'l2',
    number: 'LOOK 02',
    title: 'Garden Ceremony',
    collectionTitle: 'Bridal',
    note: 'A white dress with a red Dinguza yoke, photographed in a garden.',
    image: fbPhotos.couplePark,
  },
  {
    id: 'l3',
    number: 'LOOK 03',
    title: 'Studio Ensemble',
    collectionTitle: 'Women',
    note: 'Friends in the studio wearing white shirts and dresses with Dinguza trim.',
    image: fbPhotos.studioFour,
  },
  {
    id: 'l4',
    number: 'LOOK 04',
    title: 'Showroom Duo',
    collectionTitle: 'Women',
    note: 'Two full skirts finished with patterned hems, in the showroom.',
    image: fbPhotos.studioTwo,
  },
  {
    id: 'l5',
    number: 'LOOK 05',
    title: 'Celebration Line',
    collectionTitle: 'Special Occasions',
    note: 'A group dressed alike in white shirts with Dinguza panels.',
    image: fbPhotos.groupEvent,
  },
  {
    id: 'l6',
    number: 'LOOK 06',
    title: 'Forest Gathering',
    collectionTitle: 'Heritage',
    note: 'A white dress with a wide striped skirt, among the pines.',
    image: fbPhotos.groupTrees,
  },
  {
    id: 'l7',
    number: 'LOOK 07',
    title: 'Evening Heritage',
    collectionTitle: 'Modern',
    note: 'A white dress with a red Dinguza bodice for an evening out.',
    image: fbPhotos.evening,
  },
  {
    id: 'l8',
    number: 'LOOK 08',
    title: 'City Lights',
    collectionTitle: 'Special Occasions',
    note: 'A couple in matching Dinguza trim in front of the monument.',
    image: fbPhotos.monument,
  },
]

export const cultureTopics: CultureTopic[] = [
  {
    id: 'ct1',
    title: 'Traditional Wolaita clothing',
    explanation:
      'In Wolaita, clothing is worn with pride at holidays, weddings and gatherings. White cotton garments finished with woven colour are the heart of what we make.',
    image: shots.intro,
  },
  {
    id: 'ct2',
    title: 'Patterns',
    explanation:
      'Dinguza is recognised by its bands and by the stepped blocks that run between them. We place the pattern at the hem, the bodice, the cuffs or across the whole garment.',
    image: shots.weave,
  },
  {
    id: 'ct3',
    title: 'Colors',
    explanation:
      'Red, black and yellow are the colours of Dinguza. Red and black lead, with yellow as the thin line between them, set against white cotton.',
    image: shots.gold,
  },
  {
    id: 'ct4',
    title: 'Fabrics',
    explanation:
      'We work with soft white cotton for the body of a garment and woven Dinguza for the colour. Ask in the studio to see and feel the cloth before you order.',
    image: shots.linen,
  },
  {
    id: 'ct5',
    title: 'Accessories',
    explanation:
      'Scarves, hats, headwraps and bags in Dinguza complete an outfit, and make a good gift on their own.',
    image: shots.gold,
  },
  {
    id: 'ct6',
    title: 'Cultural occasions',
    explanation:
      'Weddings, holidays, graduations and church events are when families dress together. We prepare matching outfits for the whole group.',
    image: shots.ceremony,
  },
  {
    id: 'ct7',
    title: 'Symbolism',
    explanation:
      'The colours and patterns carry meaning for the people who wear them. We are glad to share what we know when you visit the studio.',
    image: shots.dusk,
  },
  {
    id: 'ct8',
    title: 'Modern interpretation',
    explanation:
      'We keep the cloth and change the cut: gowns, jackets, shirts and children’s wear that fit the way people dress today.',
    image: shots.studio,
  },
]

export const craftSteps: CraftStep[] = [
  {
    id: 's1',
    number: '01',
    title: 'Inspiration',
    text: 'Every piece begins with the occasion and the person: who will wear it, where, and what they want it to say.',
    image: shots.landscape,
  },
  {
    id: 's2',
    number: '02',
    title: 'Design',
    text: 'We agree the style with you: the cut, the length, and where the Dinguza will sit on the garment.',
    image: shots.paper,
  },
  {
    id: 's3',
    number: '03',
    title: 'Material Selection',
    text: 'You choose the cloth and the colours from what we have in the studio, and we take your measurements.',
    image: shots.linen,
  },
  {
    id: 's4',
    number: '04',
    title: 'Craftsmanship',
    text: 'The garment is cut and sewn, and the woven bands are joined and finished by hand.',
    image: shots.hands,
  },
  {
    id: 's5',
    number: '05',
    title: 'Final Look',
    text: 'You try it on, we adjust the fit, and it is ready to wear, to collect at the studio or to be sent to you.',
    image: shots.hero,
  },
]

export const occasions: Occasion[] = [
  {
    id: 'o1',
    title: 'Weddings',
    text: 'Gowns and suits for the couple, and matching outfits for family and friends.',
    image: shots.ceremony,
  },
  {
    id: 'o2',
    title: 'Cultural celebrations',
    text: 'Outfits in the Wolaita colours for holidays and community celebrations.',
    image: shots.landscape,
  },
  {
    id: 'o3',
    title: 'Festivals',
    text: 'Group outfits for festival days, made to match for a whole team.',
    image: shots.gold,
  },
  {
    id: 'o4',
    title: 'Traditional ceremonies',
    text: 'Dinguza suits and white shawls for elders and for family ceremonies.',
    image: shots.intro,
  },
  {
    id: 'o5',
    title: 'Fashion events',
    text: 'Statement gowns and jackets for stages, shows and formal evenings.',
    image: shots.studio,
  },
  {
    id: 'o6',
    title: 'Photoshoots',
    text: 'Outfits that photograph beautifully, for couples, families and graduates.',
    image: shots.thread,
  },
]

export const journal: JournalPost[] = [
  {
    id: 'j1',
    slug: 'heritage-reimagined',
    title: 'Heritage, reimagined',
    excerpt:
      'How the cloth of Wolaita finds its place in the way we dress today.',
    body: 'Dinguza has long been worn for the days that matter. At Woynu Malala we keep the cloth as it is, with its bands of red, black and yellow, and change what we make from it. A gown for an evening event, a jacket over jeans, a dress for the office, a small outfit for a child: each carries the same cloth into a different part of life. That is what we mean by our slogan, ባህላችንን በውበት, our culture in beauty. Visit the studio in Wolaita Sodo, or send us your idea on WhatsApp, and we will show you what the cloth can become.',
    category: 'Fashion stories',
    dateLabel: 'Journal',
    published: true,
    cover: shots.intro,
  },
  {
    id: 'j2',
    slug: 'behind-the-cloth',
    title: 'Behind the cloth',
    excerpt: 'From your first message to the final fitting: how an order is made.',
    body: 'An order starts with a conversation, in the studio or on WhatsApp. Tell us the occasion, who the outfit is for and the date you need it. We agree the style and where the Dinguza will sit, then take your measurements or work from the ones you send. You choose the cloth, we cut and sew, and the woven bands are finished by hand. Before it leaves us you try it on and we adjust the fit. You can collect it at the studio in Wolaita Sodo or ask us about delivery to your town.',
    category: 'Behind the scenes',
    dateLabel: 'Journal',
    published: true,
    cover: shots.scissors,
  },
  {
    id: 'j3',
    slug: 'styling-wolaita',
    title: 'Styling Wolaita for today',
    excerpt: 'Simple ways to wear Dinguza every day, not only on holidays.',
    body: 'You do not need a holiday to wear Dinguza. A scarf or a hat over ordinary clothes is the easiest start. A white shirt with Dinguza panels works with jeans. A dress with a Dinguza yoke and waistband is light enough for every day. For couples and friends, matching one detail, such as the trim on a dress and a scarf, is often enough. If you are not sure what suits you, visit the studio or send us a photo and we will suggest something.',
    category: 'Styling ideas',
    dateLabel: 'Journal',
    published: true,
    cover: shots.weave,
  },
]

export const story = {
  heading: 'Our Story',
  blocks: [
    {
      title: 'Beginnings',
      text: 'Woynu Malala Cultural Cloth Design and Decor is a studio in Wolaita Sodo. We design and sew cultural clothing, and we prepare décor for celebrations.',
    },
    {
      title: 'Wolaita',
      text: 'Wolaita is our home and the source of our work. Dinguza, its cloth of red, black and yellow bands, runs through almost everything we make.',
    },
    {
      title: 'Fashion',
      text: 'We believe cultural clothing should be worn, not kept away for one day a year. So we make it comfortable, well fitted and beautiful.',
    },
    {
      title: 'Purpose',
      text: 'Our purpose is in our slogan: ባህላችንን በውበት, our culture in beauty. We want every customer to carry Wolaita with pride.',
    },
    {
      title: 'Approach',
      text: 'We listen first. Then we agree the design, take measurements, choose the cloth together, sew, and fit the garment until it is right.',
    },
    {
      title: 'Future',
      text: 'We want to dress more families and more celebrations, and to make ordering easy from wherever you are, starting with this website.',
    },
  ],
  designer: '',
}

/**
 * Customer words. These three are empty slots: the home page shows the testimonials section
 * only once at least one has a real quote (with the customer's permission) and
 * `placeholder: false`. Nothing here is an invented quote.
 */
export const testimonials = [
  {
    id: 't1',
    quote: '[Customer testimonial — to be provided by Woynu Malala]',
    name: '[Customer name]',
    detail: '[Occasion · Town]',
    placeholder: true,
  },
  {
    id: 't2',
    quote: '[Customer testimonial — to be provided by Woynu Malala]',
    name: '[Customer name]',
    detail: '[Occasion · Town]',
    placeholder: true,
  },
  {
    id: 't3',
    quote: '[Customer testimonial — to be provided by Woynu Malala]',
    name: '[Customer name]',
    detail: '[Occasion · Town]',
    placeholder: true,
  },
]

export const testimonialsPlaceholder =
  '[Testimonials — Client Content Needed] Real customer words will appear here. None have been invented.'

export const seenWornNote =
  'Moments from the studio, celebrations, and group shoots — shared on our Facebook page.'

// The "Seen & worn" gallery. A file in images/gallery/01…08 replaces the photo in that place.
const facebookPreviews = [
  fbPhotos.studioFour,
  shots.ceremony,
  fbPhotos.groupEvent,
  fbPhotos.couple,
  fbPhotos.groupTrees,
  shots.gold,
  fbPhotos.monument,
  fbPhotos.evening,
].map(({ src, alt }) => ({ src, alt }))

/** What each photo in images/gallery/ shows (alt text), in file order 01…08. */
const galleryAlts = [
  'A couple in Dinguza outfits, the man in a shirt with a "50" motif',
  'A woman in a white dress with Dinguza trim at a venue decorated with flowers and leaves',
  'A long line of women in white dresses with Dinguza sashes at an outdoor celebration',
  'Elders in Dinguza suits and white shawls holding staffs',
  'Men in Dinguza suits, hats and scarves at an outdoor gathering',
  'A family in white and Dinguza clothing in a field of yellow flowers',
  'A group in white and red Wolaita dresses at the Sodo city monument at night',
  'A couple in white garments with Dinguza trim, holding a Dinguza bag',
]

export const facebookPhotos = facebookPreviews.map((photo, i) => {
  const src = imageFor(`gallery/${pad2(i + 1)}`)
  return src ? { src, alt: galleryAlts[i] ?? photo.alt } : photo
})

// ---------------------------------------------------------------------------
// Studio photos: any file saved in src/assets/images/ with the names below
// replaces the default image automatically (see src/assets/images/README.md).
// ---------------------------------------------------------------------------
for (const c of collections) {
  c.cover = slot(`collections/${c.slug}/cover`, c.cover, `${c.title} — Woynu Malala`)
  c.designs.forEach((d, i) => {
    d.images = [slot(`collections/${c.slug}/design-${i + 1}`, d.images[0], `${d.name} — ${c.title}`), ...d.images.slice(1)]
  })
}
looks.forEach((l, i) => {
  l.image = slot(`lookbook/look-${pad2(i + 1)}`, l.image, `${l.title} — Woynu Malala lookbook`)
})
cultureTopics.forEach((topic) => {
  topic.image = slot(`culture/${slugify(topic.title)}`, topic.image, topic.title)
})
craftSteps.forEach((step) => {
  step.image = slot(`craftsmanship/step-${step.number}`, step.image, `${step.title} — Woynu Malala craftsmanship`)
})
occasions.forEach((o) => {
  o.image = slot(`occasions/${slugify(o.title)}`, o.image, `${o.title} — Woynu Malala`)
})
journal.forEach((post) => {
  post.cover = slot(`journal/${post.slug}`, post.cover, post.title)
})
