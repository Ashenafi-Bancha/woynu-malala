import { Seo } from '../components/Seo'
import { WoynuAI } from '../components/woynu-ai/WoynuAI'

export function WoynuAIPage() {
  return (
    <div className="relative overflow-hidden">
      <Seo
        title="Woynu AI — Cultural Style Consultation"
        path="/woynu-ai"
        description="Discover a Wolaita-inspired cultural style made for you. Woynu AI turns your occasion, style, and colours into a personal design concept."
      />
      <div
        aria-hidden="true"
        className="float-3d pointer-events-none absolute -left-40 top-20 hidden h-[55vh] w-[50vw] rounded-full bg-gold/10 blur-[140px] md:block"
      />
      <div className="relative mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-12 md:pt-36">
        <WoynuAI />
      </div>
    </div>
  )
}
