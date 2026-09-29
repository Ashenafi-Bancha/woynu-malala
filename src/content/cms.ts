export type CollectionRecord = {
  id: string
  slug: string
  title: string
  intro: string
  published: boolean
  images: string[]
}

export type DesignRecord = {
  id: string
  name: string
  description: string
  collectionId: string
  images: string[]
  featured: boolean
}

export type LookRecord = {
  id: string
  title: string
  order: number
  image: string
}

export type CultureRecord = {
  id: string
  title: string
  body: string
  category: string
  image: string
}

export type JournalRecord = {
  id: string
  slug: string
  title: string
  body: string
  published: boolean
  image: string
}

export type InquiryRecord = {
  id: string
  payload: Record<string, string>
  status: 'new' | 'contacted' | 'in-progress' | 'closed'
  createdAt: string
}

export type TestimonialRecord = {
  id: string
  quote: string
  attribution: string
  published: boolean
}

/**
 * Future CMS/admin surface.
 * Replace `src/content/site.ts` with fetchers against these resources.
 */
export const cmsResources = {
  collections: '/api/collections',
  designs: '/api/designs',
  lookbook: '/api/lookbook',
  culture: '/api/culture',
  journal: '/api/journal',
  inquiries: '/api/inquiries',
  testimonials: '/api/testimonials',
  // Woynu AI (live: POST /api/woynu-ai). Admin resources below are planned, not yet built;
  // their data currently lives in server/woynu-ai/culturalRules.ts and src/woynu-ai/shared/options.ts.
  woynuAiGenerate: '/api/woynu-ai',
  woynuAiRules: '/api/woynu-ai/rules',
  woynuAiOptions: '/api/woynu-ai/options',
  woynuAiDesigns: '/api/woynu-ai/designs',
} as const
