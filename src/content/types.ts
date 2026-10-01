export type PlaceholderNote = string

export type MediaAsset = {
  src: string
  alt: string
  placeholder: boolean
  caption: PlaceholderNote
  tone: 'ink' | 'earth' | 'gold' | 'ivory' | 'moss'
  /** Small source image: shown framed over a blurred fill instead of stretched */
  lowRes?: boolean
  /** Responsive sources, e.g. '/a-720.webp 720w, /a-1280.webp 1280w' */
  srcSet?: string
}

export type Collection = {
  id: string
  slug: string
  title: string
  kicker: string
  intro: string
  published: boolean
  featured: boolean
  cover: MediaAsset
  designs: Design[]
}

export type Design = {
  id: string
  name: string
  description: string
  culturalNote: string
  images: MediaAsset[]
  featured: boolean
}

export type Look = {
  id: string
  number: string
  title: string
  collectionTitle: string
  note: string
  image: MediaAsset
}

export type CultureTopic = {
  id: string
  title: string
  explanation: string
  image: MediaAsset
}

export type CraftStep = {
  id: string
  number: string
  title: string
  text: string
  image: MediaAsset
}

export type JournalPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  dateLabel: string
  published: boolean
  cover: MediaAsset
}

export type Occasion = {
  id: string
  title: string
  text: string
  image: MediaAsset
}

export type InquiryStatus = 'new' | 'contacted' | 'in-progress' | 'closed'

export type CustomInquiry = {
  name: string
  phone: string
  email: string
  gender: string
  occasion: string
  preferredStyle: string
  preferredColors: string
  size: string
  eventDate: string
  description: string
}
