export function Testimonial({
  quote,
  attribution,
}: {
  quote: string
  attribution: string
}) {
  return (
    <blockquote className="border-l border-gold pl-6">
      <p className="font-serif text-2xl italic text-ivory/90">{quote}</p>
      <footer className="mt-4 text-[11px] uppercase tracking-[0.22em] text-stone">{attribution}</footer>
    </blockquote>
  )
}
