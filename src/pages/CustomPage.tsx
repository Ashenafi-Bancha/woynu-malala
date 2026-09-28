import { shots } from '../content/media'
import { CustomDesignForm } from '../components/CustomDesignForm'
import { Frame3D } from '../components/Frame3D'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { SplitTitle, headingClass } from '../components/SplitTitle'
import { useI18n } from '../i18n'

export function CustomPage() {
  const { t } = useI18n()
  return (
    <div className="relative overflow-hidden">
      <Seo
        title="Custom Design"
        path="/custom"
        description="Request a custom Woynu Malala design for your occasion, style, and story."
      />
      <div
        aria-hidden="true"
        className="float-3d pointer-events-none absolute -left-40 top-20 hidden h-[55vh] w-[50vw] rounded-full bg-gold/10 blur-[140px] md:block"
      />
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 pb-24 pt-28 md:px-12 md:pt-40 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('custom.kicker')}</p>
            <h1 className={`mt-5 ${headingClass} text-5xl sm:text-6xl md:text-8xl`}>
              <SplitTitle text={t('custom.title')} />
            </h1>
            <div className="gold-rule mt-8 w-40" />
            <p className="mt-8 max-w-md text-base leading-8 text-ivory/65 md:text-lg">
              {t('custom.text')}
            </p>
          </Reveal>
          {/* Phones: the photo sits between the intro and the form */}
          <Reveal tilt className="mx-auto mt-12 w-full max-w-xs lg:hidden">
            <Frame3D media={shots.hands} className="aspect-[4/5] w-full" />
          </Reveal>
          <Reveal tilt delay={100} className="mt-12">
            <div className="border border-ivory/10 bg-ink-soft/80 p-6 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)] backdrop-blur-sm md:p-10">
              <CustomDesignForm />
            </div>
          </Reveal>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-32">
            <Reveal tilt delay={150}>
              <Frame3D media={shots.hands} className="aspect-[4/5] w-full" caption={t('custom.title')} />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
