/**
 * The Woynu Malala logo, shown exactly as the studio's artwork (white "WM" monogram on
 * wood). public/logo.jpg is a small copy of src/assets/logo.png; it is not recoloured
 * or cropped.
 */
export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <img
      src="/logo.jpg"
      alt="Woynu Malala logo"
      width={256}
      height={256}
      decoding="async"
      className={`block object-cover ${className}`}
    />
  )
}
