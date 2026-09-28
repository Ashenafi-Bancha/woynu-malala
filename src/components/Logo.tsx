/**
 * Vector recreation of the Woynu Malala "WM" monogram: overlapping serif W and M
 * inside a ring with two small dots. Replace with the original artwork file when available.
 */
export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Woynu Malala logo">
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="19" cy="19" r="4.2" fill="currentColor" />
      <circle cx="81" cy="81" r="4.2" fill="currentColor" />
      <g fill="currentColor" fontFamily="'Cormorant Garamond', 'Times New Roman', serif" fontWeight="500">
        <text x="40" y="60" fontSize="46" textAnchor="middle">
          W
        </text>
        <text x="60" y="75" fontSize="46" textAnchor="middle">
          M
        </text>
      </g>
    </svg>
  )
}
