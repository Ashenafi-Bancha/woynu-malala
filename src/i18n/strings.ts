// Interface text in English and Amharic. English is the source of truth:
// every key in `en` must also exist in `am` (TypeScript enforces this).
// Amharic translations should be reviewed by a native speaker at the studio.

export const en = {
  // Navigation & chrome
  'nav.collections': 'Collections',
  'nav.lookbook': 'Lookbook',
  'nav.story': 'Our Story',
  'nav.culture': 'Culture',
  'nav.custom': 'Custom',
  'nav.journal': 'Journal',
  'nav.contact': 'Contact',
  'nav.craftsmanship': 'Craftsmanship',
  'nav.woynuAi': 'Woynu AI',
  'nav.menu': 'Menu',
  'nav.close': 'Close',
  'nav.language': 'Language',
  'social.follow': 'Follow us',
  'social.soon': 'link coming soon',
  'common.loading': 'Loading',
  'common.rights': 'All rights reserved.',
  'common.socialNote': 'Instagram and TikTok links are coming soon.',

  // Brand
  'brand.shortName': 'Woynu Malala',
  'brand.descriptor': 'Cultural Cloth Design and Decor',
  'brand.name': 'Woynu Malala Cultural Cloth Design and Decor',
  'brand.tagline': 'Wolaita Heritage. Reimagined.',
  'brand.statement': 'Traditional Wolaita identity transformed into contemporary fashion.',
  'brand.location': 'Wolaita Sodo, Ethiopia',
  'brand.place': 'Wolaita Sodo · Ethiopia',
  'brand.followers': 'followers',

  // Hero
  'hero.explore': 'Explore Collections',
  'hero.lookbook': 'View Lookbook',
  'hero.caption': 'Heritage, worn today.',

  // Home
  'home.introKicker': 'Introduction',
  'home.introTitle': 'Where heritage becomes fashion',
  'home.introText':
    'Woynu Malala Cultural Cloth Design and Decor combines Wolaita cultural identity with contemporary fashion. The studio presents, preserves, and evolves dress — not as costume, but as living craft.',
  'home.readStory': 'Read our story',
  'home.collectionsTitle': 'Explore our collections',
  'home.quote1': 'Born from Wolaita heritage.',
  'home.quote2': 'Designed for today.',
  'home.cultureTitle': 'The culture behind the design',
  'home.cultureText':
    'Clothing here is a language. This chapter helps visitors understand the identity inside the cloth — not only the silhouette.',
  'home.readMore': 'Read more',
  'home.occasionsKicker': 'Occasions',
  'home.occasionsTitle': 'Worn for the moments that matter',
  'home.seenKicker': 'Presence',
  'home.seenTitle': 'Seen & worn',
  'home.seenText': 'Moments from the studio, celebrations, and group shoots — shared on our Facebook page.',
  'home.seeFacebook': 'See more on Facebook',
  'home.journalTitle': 'Stories from the studio',
  'home.contactTitle': 'Wear your heritage',
  'home.contactText':
    'Discover a design, request a custom piece, or visit Woynu Malala Cultural Cloth Design and Decor.',

  // Process
  'process.kicker': 'Process',
  'process.title': 'Crafted with purpose',
  'process.text': 'Every piece carries a story.',

  // Collections
  'collections.kicker': 'The Index',
  'collections.count': 'Collections',
  'collections.intro': 'Wolaita heritage, cut for today — from ceremonial pieces to everyday elegance.',
  'collections.hint': 'Move over a collection to explore',
  'collections.view': 'View collection',
  'collections.designs': 'Designs',
  'collections.inquire': 'Inquire about this design',
  'collections.notFound': 'Collection not found',
  'collections.back': 'Back to collections',

  // Lookbook
  'lookbook.kicker': 'Woynu Malala Lookbook',
  'lookbook.title': 'The Looks',
  'lookbook.hint': 'Drag, swipe, or use the arrow keys',
  'lookbook.prev': 'Previous look',
  'lookbook.next': 'Next look',

  // Story
  'story.kicker': 'About',
  'story.title': 'Our Story',
  'story.intro': 'How a studio in Wolaita Sodo carries heritage into everyday fashion.',
  'story.designer': 'Designer',

  // Culture
  'culture.kicker': 'Heritage',
  'culture.intro': 'Patterns, colours, fabrics, and the meaning each one carries.',

  // Craftsmanship
  'craft.kicker': 'Craftsmanship',
  'craft.title': 'Made by hand',
  'craft.intro': 'Inspiration, design, materials, and craft behind every garment.',

  // Custom
  'custom.kicker': 'Atelier',
  'custom.title': 'Create your own look',
  'custom.text':
    'Have a design in mind? Work with Woynu Malala to create something made for your occasion, your style, and your story.',

  // Journal
  'journal.kicker': 'Editorial',
  'journal.intro': 'Fashion stories, cultural notes, and writing from the studio.',
  'journal.read': 'Read story',
  'journal.notFound': 'Story not found',
  'journal.back': 'Back to journal',

  // Contact
  'contact.kicker': 'Studio',
  'contact.location': 'Location',
  'contact.phone': 'Phone',
  'contact.whatsapp': 'WhatsApp',
  'contact.facebook': 'Facebook',
  'contact.instagram': 'Instagram',
  'contact.call': 'Call',
  'contact.visit': 'Visit studio',
  'contact.custom': 'Custom design',
  'contact.directions': 'Get directions',
  'contact.chat': 'Chat on WhatsApp',
  'contact.callUs': 'Call us',
  'contact.hoursNote': 'Call or message us to arrange a studio visit or fitting.',

  // Form
  'form.name': 'Name',
  'form.phone': 'Phone',
  'form.email': 'Email',
  'form.gender': 'Gender',
  'form.select': 'Select',
  'form.woman': 'Woman',
  'form.man': 'Man',
  'form.child': 'Child',
  'form.noSay': 'Prefer not to say',
  'form.occasion': 'Occasion',
  'form.style': 'Preferred style',
  'form.colors': 'Preferred colors',
  'form.size': 'Size / measurements',
  'form.date': 'Event date',
  'form.description': 'Description',
  'form.reference': 'Reference image',
  'form.submit': 'Request a Custom Design',
  'form.sent':
    'Request saved on this device. When the site is connected to a server, requests will reach the studio. No message has been sent yet.',
} as const

export type Key = keyof typeof en

export const am: Record<Key, string> = {
  'nav.collections': 'ስብስቦች',
  'nav.lookbook': 'የአልባሳት ማሳያ',
  'nav.story': 'ታሪካችን',
  'nav.culture': 'ባህል',
  'nav.custom': 'ልዩ ትዕዛዝ',
  'nav.journal': 'መጽሔት',
  'nav.contact': 'ያግኙን',
  'nav.craftsmanship': 'የእጅ ጥበብ',
  'nav.woynuAi': 'ወይኑ AI',
  'nav.menu': 'ማውጫ',
  'nav.close': 'ዝጋ',
  'nav.language': 'ቋንቋ',
  'social.follow': 'ይከተሉን',
  'social.soon': 'አድራሻው በቅርቡ ይገባል',
  'common.loading': 'በመጫን ላይ',
  'common.rights': 'መብቱ በሕግ የተጠበቀ ነው።',
  'common.socialNote': 'የኢንስታግራም እና የቲክቶክ አድራሻዎች በቅርቡ ይገባሉ።',

  'brand.shortName': 'ወይኑ ማላላ',
  'brand.descriptor': 'ባህላዊ አልባሳት ዲዛይን እና ዲኮር',
  'brand.name': 'ወይኑ ማላላ ባህላዊ አልባሳት ዲዛይን እና ዲኮር',
  'brand.tagline': 'የወላይታ ቅርስ በአዲስ እይታ።',
  'brand.statement': 'ባህላዊው የወላይታ ማንነት በዘመናዊ ፋሽን ሲገለጽ።',
  'brand.location': 'ወላይታ ሶዶ፣ ኢትዮጵያ',
  'brand.place': 'ወላይታ ሶዶ · ኢትዮጵያ',
  'brand.followers': 'ተከታዮች',

  'hero.explore': 'ስብስቦችን ይመልከቱ',
  'hero.lookbook': 'የአልባሳት ማሳያ',
  'hero.caption': 'ቅርስ፣ ዛሬም ይለበሳል።',

  'home.introKicker': 'መግቢያ',
  'home.introTitle': 'ቅርስ ፋሽን የሚሆንበት',
  'home.introText':
    'ወይኑ ማላላ ባህላዊ አልባሳት ዲዛይን እና ዲኮር የወላይታን ባህላዊ ማንነት ከዘመናዊ ፋሽን ጋር ያጣምራል። ስቱዲዮው አልባሳትን እንደ ጌጥ ብቻ ሳይሆን እንደ ሕያው ጥበብ ያቀርባል፣ ይጠብቃል፣ ያሳድጋል።',
  'home.readStory': 'ታሪካችንን ያንብቡ',
  'home.collectionsTitle': 'ስብስቦቻችንን ይመልከቱ',
  'home.quote1': 'ከወላይታ ቅርስ የተወለደ።',
  'home.quote2': 'ለዛሬ የተዘጋጀ።',
  'home.cultureTitle': 'ከዲዛይኑ ጀርባ ያለው ባህል',
  'home.cultureText':
    'እዚህ አልባሳት ቋንቋ ነው። ይህ ክፍል ጎብኚዎች ከቅርጹ ባሻገር በጨርቁ ውስጥ ያለውን ማንነት እንዲረዱ ያግዛል።',
  'home.readMore': 'ተጨማሪ ያንብቡ',
  'home.occasionsKicker': 'አጋጣሚዎች',
  'home.occasionsTitle': 'ለልዩ ጊዜያት የሚለበስ',
  'home.seenKicker': 'በአደባባይ',
  'home.seenTitle': 'የተለበሱ',
  'home.seenText': 'ከስቱዲዮው፣ ከበዓላት እና ከቡድን ፎቶዎች የተወሰዱ ጊዜያት — በፌስቡክ ገጻችን የተጋሩ።',
  'home.seeFacebook': 'በፌስቡክ ተጨማሪ ይመልከቱ',
  'home.journalTitle': 'ከስቱዲዮው የተገኙ ታሪኮች',
  'home.contactTitle': 'ቅርስዎን ይልበሱ',
  'home.contactText':
    'ዲዛይን ያግኙ፣ ልዩ ትዕዛዝ ይጠይቁ ወይም ወይኑ ማላላ ባህላዊ አልባሳት ዲዛይን እና ዲኮርን ይጎብኙ።',

  'process.kicker': 'ሂደት',
  'process.title': 'በዓላማ የተሠራ',
  'process.text': 'እያንዳንዱ ልብስ ታሪክ ይዟል።',

  'collections.kicker': 'ማውጫ',
  'collections.count': 'ስብስቦች',
  'collections.intro': 'የወላይታ ቅርስ ለዛሬ ተሰፍቶ — ከሥነ ሥርዓት አልባሳት እስከ ዕለታዊ ውበት።',
  'collections.hint': 'ለማየት ጠቋሚውን በስብስብ ላይ ያንቀሳቅሱ',
  'collections.view': 'ስብስቡን ይመልከቱ',
  'collections.designs': 'ዲዛይኖች',
  'collections.inquire': 'ስለዚህ ዲዛይን ይጠይቁ',
  'collections.notFound': 'ስብስቡ አልተገኘም',
  'collections.back': 'ወደ ስብስቦች ይመለሱ',

  'lookbook.kicker': 'የወይኑ ማላላ የአልባሳት ማሳያ',
  'lookbook.title': 'ገጽታዎች',
  'lookbook.hint': 'ይጎትቱ፣ ያንሸራትቱ ወይም የቀስት ቁልፎችን ይጠቀሙ',
  'lookbook.prev': 'ቀዳሚ ገጽታ',
  'lookbook.next': 'ቀጣይ ገጽታ',

  'story.kicker': 'ስለ እኛ',
  'story.title': 'ታሪካችን',
  'story.intro': 'በወላይታ ሶዶ የሚገኝ ስቱዲዮ ቅርስን ወደ ዕለታዊ ፋሽን እንዴት እንደሚያመጣ።',
  'story.designer': 'ዲዛይነር',

  'culture.kicker': 'ቅርስ',
  'culture.intro': 'ጥለቶች፣ ቀለሞች፣ ጨርቆች እና እያንዳንዳቸው የያዙት ትርጉም።',

  'craft.kicker': 'የእጅ ጥበብ',
  'craft.title': 'በእጅ የተሠራ',
  'craft.intro': 'ከእያንዳንዱ ልብስ ጀርባ ያለው መነሳሳት፣ ዲዛይን፣ ጨርቅ እና ጥበብ።',

  'custom.kicker': 'ስቱዲዮ',
  'custom.title': 'የራስዎን ገጽታ ይፍጠሩ',
  'custom.text':
    'በአእምሮዎ ያለ ዲዛይን አለ? ለእርስዎ ዝግጅት፣ ዘይቤ እና ታሪክ የሚስማማ ልብስ ለመፍጠር ከወይኑ ማላላ ጋር ይሥሩ።',

  'journal.kicker': 'ጽሑፎች',
  'journal.intro': 'የፋሽን ታሪኮች፣ የባህል ማስታወሻዎች እና ከስቱዲዮው የተጻፉ ጽሑፎች።',
  'journal.read': 'ታሪኩን ያንብቡ',
  'journal.notFound': 'ታሪኩ አልተገኘም',
  'journal.back': 'ወደ መጽሔት ይመለሱ',

  'contact.kicker': 'ስቱዲዮ',
  'contact.location': 'አድራሻ',
  'contact.phone': 'ስልክ',
  'contact.whatsapp': 'ዋትስአፕ',
  'contact.facebook': 'ፌስቡክ',
  'contact.instagram': 'ኢንስታግራም',
  'contact.call': 'ይደውሉ',
  'contact.visit': 'ስቱዲዮውን ይጎብኙ',
  'contact.custom': 'ልዩ ዲዛይን',
  'contact.directions': 'አቅጣጫ ያግኙ',
  'contact.chat': 'በዋትስአፕ ያውሩን',
  'contact.callUs': 'ይደውሉልን',
  'contact.hoursNote': 'ስቱዲዮውን ለመጎብኘት ወይም ልኬት ለመውሰድ ይደውሉልን ወይም መልዕክት ይላኩልን።',

  'form.name': 'ስም',
  'form.phone': 'ስልክ',
  'form.email': 'ኢሜይል',
  'form.gender': 'ጾታ',
  'form.select': 'ይምረጡ',
  'form.woman': 'ሴት',
  'form.man': 'ወንድ',
  'form.child': 'ልጅ',
  'form.noSay': 'መግለጽ አልፈልግም',
  'form.occasion': 'ዝግጅት',
  'form.style': 'የሚመርጡት ዘይቤ',
  'form.colors': 'የሚመርጧቸው ቀለሞች',
  'form.size': 'መጠን / ልኬቶች',
  'form.date': 'የዝግጅቱ ቀን',
  'form.description': 'ማብራሪያ',
  'form.reference': 'የማጣቀሻ ምስል',
  'form.submit': 'ልዩ ዲዛይን ይጠይቁ',
  'form.sent':
    'ጥያቄዎ በዚህ መሣሪያ ላይ ተቀምጧል። ድረ-ገጹ ከአገልጋይ ጋር ሲገናኝ ጥያቄዎች ወደ ስቱዲዮው ይደርሳሉ። እስካሁን ምንም መልዕክት አልተላከም።',
}

/**
 * Amharic for content that lives in src/content/site.ts, keyed by the English text.
 * Anything missing here (such as "[Client Content Needed]" placeholders) stays in English.
 */
export const contentAm: Record<string, string> = {
  // Collections
  'Wolaita Heritage': 'የወላይታ ቅርስ',
  'Modern Wolaita': 'ዘመናዊ ወላይታ',
  'Bridal Collection': 'የሙሽራ ስብስብ',
  "Women's Collection": 'የሴቶች ስብስብ',
  "Men's Collection": 'የወንዶች ስብስብ',
  "Children's Collection": 'የልጆች ስብስብ',
  'Special Occasions': 'ልዩ ዝግጅቶች',
  'Custom Designs': 'ልዩ ትዕዛዝ ዲዛይኖች',
  // Looks
  'Heritage Pair': 'የቅርስ ጥንድ',
  'Garden Ceremony': 'የአትክልት ሥፍራ ሥነ ሥርዓት',
  'Studio Ensemble': 'የስቱዲዮ ስብስብ',
  'Showroom Duo': 'የማሳያ ክፍል ጥንድ',
  'Celebration Line': 'የበዓል ሰልፍ',
  'Forest Gathering': 'የጫካ ስብሰባ',
  'Evening Heritage': 'የምሽት ቅርስ',
  'City Lights': 'የከተማ መብራቶች',
  Heritage: 'ቅርስ',
  Bridal: 'ሙሽራ',
  Women: 'ሴቶች',
  Modern: 'ዘመናዊ',
  // Culture topics
  'Traditional Wolaita clothing': 'ባህላዊ የወላይታ አልባሳት',
  'Traditional clothing': 'ባህላዊ አልባሳት',
  Patterns: 'ጥለቶች',
  Colors: 'ቀለሞች',
  Fabrics: 'ጨርቆች',
  Accessories: 'ጌጣጌጦች',
  'Cultural occasions': 'ባህላዊ አጋጣሚዎች',
  Symbolism: 'ተምሳሌትነት',
  'Modern interpretation': 'ዘመናዊ ትርጓሜ',
  'The culture behind the design': 'ከዲዛይኑ ጀርባ ያለው ባህል',
  // Craft steps
  Inspiration: 'መነሳሳት',
  Design: 'ዲዛይን',
  'Material Selection': 'የጨርቅ ምርጫ',
  Craftsmanship: 'የእጅ ጥበብ',
  'Final Look': 'የመጨረሻው ገጽታ',
  // Occasions
  Weddings: 'ሠርግ',
  'Cultural celebrations': 'ባህላዊ በዓላት',
  Festivals: 'ፌስቲቫሎች',
  'Traditional ceremonies': 'ባህላዊ ሥነ ሥርዓቶች',
  'Fashion events': 'የፋሽን ዝግጅቶች',
  Photoshoots: 'የፎቶ ቀረጻዎች',
  // Story blocks
  'Our Story': 'ታሪካችን',
  Beginnings: 'ጅማሬ',
  Wolaita: 'ወላይታ',
  Fashion: 'ፋሽን',
  Purpose: 'ዓላማ',
  Approach: 'አቀራረብ',
  Future: 'ወደፊት',
  // Journal
  'Heritage, reimagined': 'ቅርስ በአዲስ እይታ',
  'Behind the cloth': 'ከጨርቁ ጀርባ',
  'Styling Wolaita for today': 'ወላይታን ለዛሬ ማስዋብ',
  'Fashion stories': 'የፋሽን ታሪኮች',
  'Behind the scenes': 'ከመጋረጃ ጀርባ',
  'Styling ideas': 'የአለባበስ ሀሳቦች',
  Journal: 'መጽሔት',
}
