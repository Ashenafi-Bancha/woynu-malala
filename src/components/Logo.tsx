/**
 * The Woynu Malala "WM" monogram, from the studio's logo artwork (src/assets/logo.png).
 * public/logo-mark.png is the white mark cut out of that artwork; it is used as a mask
 * so the logo takes the current text colour (e.g. `text-gold`).
 */
export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Woynu Malala logo"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: 'url(/logo-mark.png)',
        maskImage: 'url(/logo-mark.png)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
