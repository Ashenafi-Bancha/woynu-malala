import { useI18n } from '../i18n'

type BrandNameProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 'responsive' centers on small screens and left-aligns from lg up */
  align?: 'left' | 'center' | 'responsive'
  className?: string
  as?: 'span' | 'h1' | 'p'
  /** Show the 'Cultural Cloth Design and Decor' line under the name */
  descriptor?: boolean
}

const styles = {
  sm: {
    name: 'whitespace-nowrap text-[1.35rem] sm:text-2xl md:text-[1.7rem]',
    descriptor: 'hidden whitespace-nowrap sm:block sm:text-[8px] sm:tracking-[0.3em] md:text-[9px]',
  },
  md: {
    name: 'text-4xl md:text-5xl',
    descriptor: 'mt-2 text-[10px] md:text-[11px] tracking-[0.32em]',
  },
  lg: {
    name: 'text-6xl md:text-7xl',
    descriptor: 'mt-3 text-xs md:text-sm tracking-[0.34em]',
  },
  xl: {
    name: 'text-[17vw] sm:text-[13vw] lg:text-[7.4vw] 2xl:text-[8.5rem]',
    descriptor: 'mt-5 text-[2.9vw] sm:text-sm lg:text-base tracking-[0.36em]',
  },
}

const alignments = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  responsive: 'items-center text-center lg:items-start lg:text-left',
}

/**
 * The brand wordmark: "Woynu Malala" set big in bold Cormorant Garamond italic,
 * with "Cultural Cloth Design and Decor" as a small, widely spaced caps line beneath.
 */
export function BrandName({
  size = 'md',
  align = 'left',
  className = '',
  as = 'span',
  descriptor = true,
}: BrandNameProps) {
  const Tag = as
  const s = styles[size]
  const { t } = useI18n()
  return (
    <Tag className={`inline-flex flex-col ${alignments[align]} ${className}`}>
      <span className={`block font-display font-bold italic leading-[0.88] tracking-[-0.01em] text-ivory ${s.name}`}>
        {t('brand.shortName')}
      </span>
      {descriptor ? (
        <span className={`block font-sans font-normal uppercase leading-snug text-gold ${s.descriptor}`}>
          {t('brand.descriptor')}
        </span>
      ) : null}
    </Tag>
  )
}
