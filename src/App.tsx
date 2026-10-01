import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BrandName } from './components/BrandName'
import { HomePage } from './pages/HomePage'

const CollectionsPage = lazy(() =>
  import('./pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage })),
)
const CollectionDetailPage = lazy(() =>
  import('./pages/CollectionDetailPage').then((m) => ({ default: m.CollectionDetailPage })),
)
const LookbookPage = lazy(() =>
  import('./pages/LookbookPage').then((m) => ({ default: m.LookbookPage })),
)
const StoryPage = lazy(() => import('./pages/StoryPage').then((m) => ({ default: m.StoryPage })))
const CulturePage = lazy(() =>
  import('./pages/CulturePage').then((m) => ({ default: m.CulturePage })),
)
const CraftsmanshipPage = lazy(() =>
  import('./pages/CraftsmanshipPage').then((m) => ({ default: m.CraftsmanshipPage })),
)
const CustomPage = lazy(() => import('./pages/CustomPage').then((m) => ({ default: m.CustomPage })))
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage })),
)
const JournalArticlePage = lazy(() =>
  import('./pages/JournalArticlePage').then((m) => ({ default: m.JournalArticlePage })),
)
const WoynuAIPage = lazy(() =>
  import('./pages/WoynuAIPage').then((m) => ({ default: m.WoynuAIPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)

const fallback = (
  <div className="grid min-h-screen place-items-center bg-ink">
    <BrandName size="md" align="center" />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'collections/:slug', element: <CollectionDetailPage /> },
      { path: 'lookbook', element: <LookbookPage /> },
      { path: 'story', element: <StoryPage /> },
      { path: 'culture', element: <CulturePage /> },
      { path: 'craftsmanship', element: <CraftsmanshipPage /> },
      { path: 'custom', element: <CustomPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'journal/:slug', element: <JournalArticlePage /> },
      { path: 'woynu-ai', element: <WoynuAIPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

export default function App() {
  return (
    <Suspense fallback={fallback}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
