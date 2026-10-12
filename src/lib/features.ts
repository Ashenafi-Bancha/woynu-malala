/**
 * Parts of the site that are built but not yet shown to the public.
 *
 * Woynu AI is hidden on the live website until it is ready. It still shows on your own
 * computer (`npm run dev`), so work on it can continue. To publish it later, either set
 * VITE_SHOW_WOYNU_AI=true in the Vercel project's environment variables and redeploy,
 * or change the line below to `true`.
 */
export const showWoynuAi = import.meta.env.DEV || import.meta.env.VITE_SHOW_WOYNU_AI === 'true'
