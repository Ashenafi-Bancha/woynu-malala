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

export const nav = [
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

export const footerNav = [
  ...nav,
  { to: '/craftsmanship', label: 'Craftsmanship' },
]

export const social = {
  instagram: { href: '#', label: 'Instagram', pending: '[Social URL — Client Information Needed]' },
  facebook: { href: 'https://www.facebook.com/profile.php?id=100082906343810', label: 'Facebook', pending: '' },
  tiktok: { href: '#', label: 'TikTok', pending: '[Social URL — Client Information Needed]' },
  whatsapp: { href: 'https://wa.me/251923400278', label: 'WhatsApp', pending: '' },
  phone: { href: 'tel:+251923400278', label: 'Call', pending: '' },
  studio: {
    href: 'https://www.google.com/maps/search/?api=1&query=Wolaita+Sodo%2C+Ethiopia',
    label: 'Visit Studio',
    pending: '[Exact street address — Client Information Needed]',
  },
}

/** Studio phone, shown locally formatted; the same number is used for calls and WhatsApp. */
export const phoneDisplay = '0923 400 278'
export const phoneInternational = '+251 923 400 278'

export const collections: Collection[] = [
  {
    id: 'c1',
    slug: 'wolaita-heritage',
    title: 'Wolaita Heritage',
    kicker: 'Collection 01',
    intro:
      '[Collection Description — Client Content Needed] A collection inspired by the traditions, patterns, textures, and identity of Wolaita.',
    published: true,
    featured: true,
    cover: fbPhotos.groupEvent,
    designs: [
      {
        id: 'd1',
        name: 'Heritage drape',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
        images: [shots.weave, shots.gold],
        featured: true,
      },
      {
        id: 'd2',
        name: 'Pattern study',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
        images: [shots.thread],
        featured: false,
      },
      {
        id: 'd3',
        name: 'Ceremonial line',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
      '[Collection Description — Client Content Needed] Contemporary silhouettes carrying Wolaita identity into everyday elegance.',
    published: true,
    featured: true,
    cover: fbPhotos.evening,
    designs: [
      {
        id: 'd4',
        name: 'City weave',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
        images: [shots.studio],
        featured: true,
      },
      {
        id: 'd5',
        name: 'Soft architecture',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
      '[Collection Description — Client Content Needed] Bridal pieces for ceremonies that honor lineage and presence.',
    published: true,
    featured: true,
    cover: fbPhotos.couplePark,
    designs: [
      {
        id: 'd6',
        name: 'Vow',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
    intro: '[Collection Description — Client Content Needed]',
    published: true,
    featured: true,
    cover: fbPhotos.studioTwo,
    designs: [
      {
        id: 'd7',
        name: 'Lineage',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
    intro: '[Collection Description — Client Content Needed]',
    published: true,
    featured: true,
    cover: fbPhotos.couple,
    designs: [
      {
        id: 'd8',
        name: 'Ground',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
    intro: '[Collection Description — Client Content Needed]',
    published: true,
    featured: false,
    cover: shots.weave,
    designs: [
      {
        id: 'd9',
        name: 'First cloth',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
    intro: '[Collection Description — Client Content Needed]',
    published: true,
    featured: true,
    cover: fbPhotos.monument,
    designs: [
      {
        id: 'd10',
        name: 'Evening heritage',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
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
      '[Collection Description — Client Content Needed] Made for a specific occasion, body, and story — by request.',
    published: true,
    featured: false,
    cover: fbPhotos.studioFour,
    designs: [
      {
        id: 'd11',
        name: 'Commission study',
        description: '[Design description — Client Content Needed]',
        culturalNote: '[Cultural context — Client Content Needed]',
        images: [shots.paper],
        featured: false,
      },
    ],
  },
]

export const looks: Look[] = [
  {
    id: 'l1',
    number: 'LOOK 01',
    title: 'Heritage Pair',
    collectionTitle: 'Heritage',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.couple,
  },
  {
    id: 'l2',
    number: 'LOOK 02',
    title: 'Garden Ceremony',
    collectionTitle: 'Bridal',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.couplePark,
  },
  {
    id: 'l3',
    number: 'LOOK 03',
    title: 'Studio Ensemble',
    collectionTitle: 'Women',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.studioFour,
  },
  {
    id: 'l4',
    number: 'LOOK 04',
    title: 'Showroom Duo',
    collectionTitle: 'Women',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.studioTwo,
  },
  {
    id: 'l5',
    number: 'LOOK 05',
    title: 'Celebration Line',
    collectionTitle: 'Special Occasions',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.groupEvent,
  },
  {
    id: 'l6',
    number: 'LOOK 06',
    title: 'Forest Gathering',
    collectionTitle: 'Heritage',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.groupTrees,
  },
  {
    id: 'l7',
    number: 'LOOK 07',
    title: 'Evening Heritage',
    collectionTitle: 'Modern',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.evening,
  },
  {
    id: 'l8',
    number: 'LOOK 08',
    title: 'City Lights',
    collectionTitle: 'Special Occasions',
    note: '[Look note — Client Content Needed]',
    image: fbPhotos.monument,
  },
]

export const cultureTopics: CultureTopic[] = [
  {
    id: 'ct1',
    title: 'Traditional Wolaita clothing',
    explanation:
      '[Culture copy — Client Content Needed] Space for how dress has marked occasion, status, and belonging in Wolaita life.',
    image: shots.intro,
  },
  {
    id: 'ct2',
    title: 'Patterns',
    explanation:
      '[Culture copy — Client Content Needed] Motifs, geometry, and the language of surface decoration.',
    image: shots.weave,
  },
  {
    id: 'ct3',
    title: 'Colors',
    explanation:
      '[Culture copy — Client Content Needed] Earth, gold, and ceremonial palettes as they appear in dress.',
    image: shots.gold,
  },
  {
    id: 'ct4',
    title: 'Fabrics',
    explanation:
      '[Culture copy — Client Content Needed] Cloth, weight, drape, and how materials carry climate and craft.',
    image: shots.linen,
  },
  {
    id: 'ct5',
    title: 'Accessories',
    explanation:
      '[Culture copy — Client Content Needed] Jewelry, belts, and finishing pieces that complete a look.',
    image: shots.gold,
  },
  {
    id: 'ct6',
    title: 'Cultural occasions',
    explanation:
      '[Culture copy — Client Content Needed] Weddings, festivals, and ceremonies that call for specific dress.',
    image: shots.ceremony,
  },
  {
    id: 'ct7',
    title: 'Symbolism',
    explanation:
      '[Culture copy — Client Content Needed] Meaning held in cut, ornament, and composition.',
    image: shots.dusk,
  },
  {
    id: 'ct8',
    title: 'Modern interpretation',
    explanation:
      '[Culture copy — Client Content Needed] How Woynu Malala carries those references into contemporary silhouettes.',
    image: shots.studio,
  },
]

export const craftSteps: CraftStep[] = [
  {
    id: 's1',
    number: '01',
    title: 'Inspiration',
    text: '[Process copy — Client Content Needed] Memory, landscape, and living tradition as a starting point.',
    image: shots.landscape,
  },
  {
    id: 's2',
    number: '02',
    title: 'Design',
    text: '[Process copy — Client Content Needed] Line, proportion, and the translation of culture into form.',
    image: shots.paper,
  },
  {
    id: 's3',
    number: '03',
    title: 'Material Selection',
    text: '[Process copy — Client Content Needed] Cloth chosen for hand, color, and how it will be worn.',
    image: shots.linen,
  },
  {
    id: 's4',
    number: '04',
    title: 'Craftsmanship',
    text: '[Process copy — Client Content Needed] Cutting, construction, and finishing as a practiced craft.',
    image: shots.hands,
  },
  {
    id: 's5',
    number: '05',
    title: 'Final Look',
    text: '[Process copy — Client Content Needed] The garment as it meets the body and the occasion.',
    image: shots.hero,
  },
]

export const occasions: Occasion[] = [
  {
    id: 'o1',
    title: 'Weddings',
    text: '[Occasion copy — Client Content Needed]',
    image: shots.ceremony,
  },
  {
    id: 'o2',
    title: 'Cultural celebrations',
    text: '[Occasion copy — Client Content Needed]',
    image: shots.landscape,
  },
  {
    id: 'o3',
    title: 'Festivals',
    text: '[Occasion copy — Client Content Needed]',
    image: shots.gold,
  },
  {
    id: 'o4',
    title: 'Traditional ceremonies',
    text: '[Occasion copy — Client Content Needed]',
    image: shots.intro,
  },
  {
    id: 'o5',
    title: 'Fashion events',
    text: '[Occasion copy — Client Content Needed]',
    image: shots.studio,
  },
  {
    id: 'o6',
    title: 'Photoshoots',
    text: '[Occasion copy — Client Content Needed]',
    image: shots.thread,
  },
]

export const journal: JournalPost[] = [
  {
    id: 'j1',
    slug: 'heritage-reimagined',
    title: 'Heritage, reimagined',
    excerpt:
      '[Journal excerpt — Client Content Needed] A note on how Wolaita identity can live in contemporary fashion.',
    body: '[Journal body — Client Content Needed] Full story to be provided by the studio.',
    category: 'Fashion stories',
    dateLabel: 'Journal',
    published: true,
    cover: shots.intro,
  },
  {
    id: 'j2',
    slug: 'behind-the-cloth',
    title: 'Behind the cloth',
    excerpt: '[Journal excerpt — Client Content Needed] From the worktable to the finished look.',
    body: '[Journal body — Client Content Needed]',
    category: 'Behind the scenes',
    dateLabel: 'Journal',
    published: true,
    cover: shots.scissors,
  },
  {
    id: 'j3',
    slug: 'styling-wolaita',
    title: 'Styling Wolaita for today',
    excerpt: '[Journal excerpt — Client Content Needed] Ideas for wearing cultural dress with ease.',
    body: '[Journal body — Client Content Needed]',
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
      text: '[Brand Story — Client Content Needed] How Woynu Malala Cultural Cloth Design and Decor started.',
    },
    {
      title: 'Wolaita',
      text: '[Brand Story — Client Content Needed] The brand’s connection to Wolaita.',
    },
    {
      title: 'Fashion',
      text: '[Brand Story — Client Content Needed] A passion for clothing as culture and craft.',
    },
    {
      title: 'Purpose',
      text: '[Brand Story — Client Content Needed] Presenting, preserving, and evolving Wolaita cultural fashion.',
    },
    {
      title: 'Approach',
      text: '[Brand Story — Client Content Needed] How the studio designs — from reference to finished garment.',
    },
    {
      title: 'Future',
      text: '[Brand Story — Client Content Needed] Vision for the years ahead.',
    },
  ],
  designer: '[Designer Name — Client Information Needed]',
}

export const testimonialsPlaceholder =
  '[Testimonials — Client Content Needed] Real customer words will appear here. None have been invented.'

export const seenWornNote =
  'Moments from the studio, celebrations, and group shoots — shared on our Facebook page.'

// Small preview thumbnails (206×206) saved from the public Facebook page.
// Replace with full-size originals from the studio when available.
const facebookPreviews = [
  { src: '/photos/facebook/fb-01.jpg', alt: 'A couple outdoors in matching red, white, and black Wolaita garments' },
  { src: '/photos/facebook/fb-02.jpg', alt: 'A couple in coordinated Wolaita cultural outfits beside a garden' },
  { src: '/photos/facebook/fb-03.jpg', alt: 'Four women in white dresses with red woven bodices inside the Woynu Malala studio' },
  { src: '/photos/facebook/fb-04.jpg', alt: 'Two women in white and red Wolaita dresses in the studio showroom' },
  { src: '/photos/facebook/fb-05.jpg', alt: 'A large group of women in matching Wolaita dresses at an outdoor event' },
  { src: '/photos/facebook/fb-06.jpg', alt: 'A group of women in white and red cultural dresses among trees' },
  { src: '/photos/facebook/fb-07.jpg', alt: 'A woman in a Wolaita dress holding a shopping bag at an evening venue' },
  { src: '/photos/facebook/fb-08.jpg', alt: 'A group in Wolaita dresses in front of a lit monument at night' },
]

/** "Seen & worn" gallery: studio photos in images/gallery/01…08 replace the Facebook previews. */
export const facebookPhotos = facebookPreviews.map((photo, i) => ({
  ...photo,
  src: imageFor(`gallery/${pad2(i + 1)}`) ?? photo.src,
}))

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
