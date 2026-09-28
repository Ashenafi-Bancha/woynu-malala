import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { am, contentAm, en, type Key } from './strings'

export type Lang = 'en' | 'am'

const STORAGE_KEY = 'wm-lang'

type I18n = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Interface text by key */
  t: (key: Key) => string
  /** Content from site.ts: returns the Amharic version when one exists */
  c: (english: string) => string
}

const I18nContext = createContext<I18n | null>(null)

function readStoredLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'am' ? 'am' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies this visit
    }
  }

  const value: I18n = {
    lang,
    setLang,
    t: (key) => (lang === 'am' ? am[key] : en[key]),
    c: (english) => (lang === 'am' ? (contentAm[english] ?? english) : english),
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider')
  return ctx
}

/** EN / አማ switch. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()
  const option = (value: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      aria-pressed={lang === value}
      lang={value}
      className={`min-h-9 min-w-10 px-2.5 text-[11px] tracking-[0.12em] transition ${
        lang === value ? 'bg-gold text-ink' : 'text-ivory/75 hover:text-gold'
      }`}
    >
      {label}
    </button>
  )
  return (
    <div role="group" aria-label={t('nav.language')} className={`inline-flex items-center border border-ivory/25 ${className}`}>
      {option('en', 'EN')}
      {option('am', 'አማ')}
    </div>
  )
}
