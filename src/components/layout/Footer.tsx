import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { interactive } from "@/utils/constants"

const linkCls =
  "rounded px-1 text-[#8f98a0] transition-colors hover:text-white active:opacity-70 focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="border-t border-white/10 bg-[#04142b] transition-colors duration-300 focus-within:border-[#66c0f4]/50"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link
            to="/"
            className={`rounded text-xl font-extrabold tracking-[0.2em] text-white ${interactive}`}
          >
            Movie Bhandaar
          </Link>

          <nav aria-label="Footer" className="flex items-center gap-5 text-sm">
            <Link to="/" className={linkCls}>Home</Link>
            <Link to="/browse" className={linkCls}>Browse</Link>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              TMDB
            </a>
          </nav>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`rounded-sm bg-white/10 px-4 py-2 text-sm font-medium text-[#b8b6b4] ${interactive}`}
          >
            ↑ Back to top
          </button>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-[#6d7580]">
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB. Prices shown
            are mock values for demonstration.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Movie Bhandaar. Built with React, Tailwind and Framer Motion.</p>
        </div>
      </div>
    </motion.footer>
  )
}