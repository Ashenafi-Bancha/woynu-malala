import { stripesCss } from './dinguzaPattern'

/**
 * Still, CSS-only version of the hero cloth. It shows instantly (so the hero is never
 * blank), stays as the final visual on low-end devices and for reduced-motion users,
 * and costs no image download.
 */
export function ClothFallback({ className = 'relative' }: { className?: string }) {
  return (
    // The caller positions this box (e.g. `absolute inset-x-[16%] …`)
    <div aria-hidden="true" className={className}>
      <div
        className="absolute inset-0 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)]"
        style={{
          backgroundImage: [
            // soft vertical folds
            'linear-gradient(90deg, rgba(0,0,0,0.55), rgba(255,255,255,0.08) 14%, rgba(0,0,0,0.38) 31%, rgba(255,255,255,0.1) 47%, rgba(0,0,0,0.42) 66%, rgba(255,255,255,0.07) 82%, rgba(0,0,0,0.5))',
            // a faint sheen so the black stripes read against the dark page
            'linear-gradient(0deg, rgba(255,240,220,0.07), rgba(255,240,220,0.07))',
            // darker toward the hem
            'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.5))',
            stripesCss(),
          ].join(', '),
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 20% 100%',
          transform: 'perspective(900px) rotateY(-16deg) rotateX(3deg)',
        }}
      />
    </div>
  )
}
