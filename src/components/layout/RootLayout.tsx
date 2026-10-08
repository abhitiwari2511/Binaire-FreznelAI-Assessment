import { useLocation, useOutlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"

export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const online = useOnlineStatus()

  return (
    <div className="flex min-h-screen flex-col">
      <div role="status" aria-live="polite">
        {!online && (
          <div className="fixed inset-x-0 bottom-0 z-50 bg-amber-500 py-2 text-center text-sm font-semibold text-black">
            You're offline. Some content may not load.
          </div>
        )}
      </div>

      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}