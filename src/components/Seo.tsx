import { useEffect } from 'react'
import { brand } from '../content/site'

type SeoProps = {
  title?: string
  description?: string
  path?: string
}

export function Seo({
  title,
  description = brand.statement,
  path = '/',
}: SeoProps) {
  const fullTitle = title
    ? `${title} | ${brand.name}`
    : `${brand.name} | ${brand.tagline}`
  const url = `${brand.siteUrl}${path}`

  useEffect(() => {
    document.title = fullTitle
    const set = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let el = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    set('description', description)
    set('og:title', fullTitle, true)
    set('og:description', description, true)
    set('og:url', url, true)
    set('twitter:title', fullTitle)
    set('twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [fullTitle, description, url])

  return null
}
