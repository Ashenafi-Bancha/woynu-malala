# Woynu Malala — website photos

Save photos in these folders using the **exact file names** below. The website picks them up
automatically and replaces the current placeholder or Facebook preview. Any image you have not
added yet keeps showing the current picture, so you can add photos a few at a time.

After adding photos, publish them with `git add -A`, `git commit -m "Add photos"`, `git push`.
Vercel updates the live site in about a minute.

## Before you add a photo

- **Format:** `.jpg` (best for photos), `.webp`, or `.png`. Any of these works for every name below.
- **Size:** about **1600–2000 px** on the longest side and **under 500 KB**. Phone photos are often
  5–10 MB — shrink them first (for example with squoosh.app), because most visitors use mobile data.
- **Shape:** portrait (4:5, e.g. 1600 × 2000) unless the table says otherwise. The site crops to fit,
  so keep the garment near the centre.
- **Names:** lowercase, exactly as written — `cover.jpg`, not `Cover.JPG` or `cover (1).jpg`.
- **Consent:** only use photos where the people shown have agreed to appear on the website.

## Home page

| File | Where it appears | Shape |
|---|---|---|
| `hero/hero.jpg` | Soft background photo behind the 3D cloth in the hero (optional) | Landscape 16:9 on desktop; crops to portrait on phones |
| `home/intro.jpg` | "Where heritage becomes fashion" section | Portrait 4:5 |
| `home/statement.jpg` | Wide banner behind "Born from Wolaita heritage" | **Landscape 16:9** |
| `home/custom.jpg` | Beside the custom design form (desktop) | Portrait 4:5 |
| `gallery/01.jpg` … `gallery/08.jpg` | "Seen & worn" photo grid | **Square 1:1** |

## Collections

Each collection has a **cover** (collection cards and the top of its page) and one photo per design.

| Folder | Collection | Files |
|---|---|---|
| `collections/wolaita-heritage/` | Wolaita Heritage | `cover.jpg`, `design-1.jpg`, `design-2.jpg`, `design-3.jpg` |
| `collections/modern-wolaita/` | Modern Wolaita | `cover.jpg`, `design-1.jpg`, `design-2.jpg` |
| `collections/bridal/` | Bridal Collection | `cover.jpg`, `design-1.jpg` |
| `collections/women/` | Women's Collection | `cover.jpg`, `design-1.jpg` |
| `collections/men/` | Men's Collection | `cover.jpg`, `design-1.jpg` |
| `collections/children/` | Children's Collection | `cover.jpg`, `design-1.jpg` |
| `collections/special-occasions/` | Special Occasions | `cover.jpg`, `design-1.jpg` |
| `collections/custom/` | Custom Designs | `cover.jpg`, `design-1.jpg` |

## Lookbook

| File | Look |
|---|---|
| `lookbook/look-01.jpg` | Look 01 — Heritage Pair |
| `lookbook/look-02.jpg` | Look 02 — Garden Ceremony |
| `lookbook/look-03.jpg` | Look 03 — Studio Ensemble |
| `lookbook/look-04.jpg` | Look 04 — Showroom Duo |
| `lookbook/look-05.jpg` | Look 05 — Celebration Line |
| `lookbook/look-06.jpg` | Look 06 — Forest Gathering |
| `lookbook/look-07.jpg` | Look 07 — Evening Heritage |
| `lookbook/look-08.jpg` | Look 08 — City Lights |

Use **square** photos for the lookbook (1:1).

## Culture page

| File | Topic |
|---|---|
| `culture/header.jpg` | Top of the Culture page |
| `culture/traditional-wolaita-clothing.jpg` | Traditional Wolaita clothing (landscape 4:3 works best) |
| `culture/patterns.jpg` | Patterns (landscape 4:3 works best) |
| `culture/colors.jpg` | Colors (landscape 4:3 works best) |
| `culture/fabrics.jpg` | Fabrics (landscape 4:3 works best) |
| `culture/accessories.jpg` | Accessories (landscape 4:3 works best) |
| `culture/cultural-occasions.jpg` | Cultural occasions (landscape 4:3 works best) |
| `culture/symbolism.jpg` | Symbolism (landscape 4:3 works best) |
| `culture/modern-interpretation.jpg` | Modern interpretation (landscape 4:3 works best) |

## Craftsmanship (also shown on the home page)

| File | Step |
|---|---|
| `craftsmanship/header.jpg` | Top of the Craftsmanship page |
| `craftsmanship/step-01.jpg` | 01 — Inspiration |
| `craftsmanship/step-02.jpg` | 02 — Design |
| `craftsmanship/step-03.jpg` | 03 — Material Selection |
| `craftsmanship/step-04.jpg` | 04 — Craftsmanship |
| `craftsmanship/step-05.jpg` | 05 — Final Look |

## Occasions (home page)

| File | Occasion |
|---|---|
| `occasions/weddings.jpg` | Weddings |
| `occasions/cultural-celebrations.jpg` | Cultural celebrations |
| `occasions/festivals.jpg` | Festivals |
| `occasions/traditional-ceremonies.jpg` | Traditional ceremonies |
| `occasions/fashion-events.jpg` | Fashion events |
| `occasions/photoshoots.jpg` | Photoshoots |

## Journal

| File | Article |
|---|---|
| `journal/heritage-reimagined.jpg` | Heritage, reimagined |
| `journal/behind-the-cloth.jpg` | Behind the cloth |
| `journal/styling-wolaita.jpg` | Styling Wolaita for today |

## Other pages

| File | Where it appears |
|---|---|
| `story/header.jpg` | Top of Our Story |
| `story/banner.jpg` | Wide scrolling banner on Our Story (landscape 16:9, at least 1600 px wide) |
| `custom/custom.jpg` | Custom design page |
| `contact/header.jpg` | Top of the Contact page |
| `woynu-ai/intro.jpg` | Woynu AI introduction |

## For developers

`src/content/images.ts` finds these files at build time with `import.meta.glob`; `slot(path, fallback)`
returns the studio photo if present, otherwise the fallback. The mapping from names to page sections
lives at the end of `src/content/site.ts` (collections, looks, culture, steps, occasions, journal,
gallery) and in `pageImages` in `src/content/media.ts`. New collections or topics get their file
names automatically from their slug or title.
