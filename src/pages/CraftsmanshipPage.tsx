import { ProcessPinned } from '../components/ProcessPinned'
import { PageHeader } from '../components/PageHeader'
import { Seo } from '../components/Seo'
import { useI18n } from '../i18n'

export function CraftsmanshipPage() {
  const { t } = useI18n()
  return (
    <div>
      <Seo
        title="Craftsmanship"
        path="/craftsmanship"
        description="Inspiration, design, materials, and craft behind every Woynu Malala garment."
      />
      <PageHeader
        kicker={t('craft.kicker')}
        title={t('craft.title')}
        intro={t('craft.intro')}
        scene="loom"
      />
      <ProcessPinned />
    </div>
  )
}
