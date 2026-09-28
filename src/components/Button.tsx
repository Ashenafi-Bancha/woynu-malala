import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const styles = {
  gold:
    'inline-flex min-h-11 items-center justify-center text-center border border-gold bg-gold px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-ink transition hover:bg-gold-bright hover:border-gold-bright',
  ghost:
    'inline-flex min-h-11 items-center justify-center text-center border border-ivory/35 bg-transparent px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-ivory transition hover:border-gold hover:text-gold',
  ink:
    'inline-flex min-h-11 items-center justify-center text-center border border-ink bg-ink px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-ivory transition hover:bg-ink-soft',
}

type Variant = keyof typeof styles

export function ButtonLink({
  to,
  children,
  variant = 'gold',
  className = '',
}: {
  to: string
  children: ReactNode
  variant?: Variant
  className?: string
}) {
  const cls = `${styles[variant]} ${className}`
  if (to.startsWith('http') || to.startsWith('mailto') || to.startsWith('tel')) {
    return (
      <a className={cls} href={to}>
        {children}
      </a>
    )
  }
  return (
    <Link className={cls} to={to}>
      {children}
    </Link>
  )
}

export function Button({
  children,
  variant = 'gold',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
