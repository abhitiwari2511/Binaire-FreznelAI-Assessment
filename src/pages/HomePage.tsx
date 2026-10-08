import { useState } from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { getPopular, getTopRated } from "@/api/tmdb"
import { useMovies } from "@/hooks/useMovies"
import { MovieCard } from "@/components/common/MovieCard"
import { Pagination } from "@/components/common/Pagination"
import { countPages, paginate } from "@/utils/pagination"
import { interactive } from "@/utils/constants"

const headingCls =
  "scroll-mt-24 text-2xl font-bold uppercase tracking-wide text-white transition-colors duration-300 target:text-[#a4d007]"

const slide: Variants = {
  enter: (d: number) => ({ opacity: 0, x: 80 * d }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: (d: number) => ({ opacity: 0, x: -80 * d, transition: { duration: 0.2 } }),
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const Skeleton = ({ n }: { n: number }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="aspect-[4/5] animate-pulse bg-white/5" />
    ))}
  </>
)

function Arrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-1/2 z-30 hidden -translate-y-1/2 rounded p-2 text-white md:block ${
        dir === "left" ? "left-2" : "right-2"
      } ${interactive}`}
    >
      <svg width="36" height="56" viewBox="0 0 36 56" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "left" ? "M28 6 8 28l20 22" : "M8 6l20 22L8 50"} />
      </svg>
    </button>
  )
}

function Featured() {
  const { movies, loading } = useMovies(getPopular, 1)
  const [page, setPage] = useState(1)
  const [dir, setDir] = useState(1)

  const list = movies.slice(0, 18)
  const total = countPages(list.length, 3)

  const go = (p: number) => {
    setDir(p > page ? 1 : -1)
    setPage(((p - 1 + total) % total) + 1) // wraps around at both ends
  }

  return (
    <section aria-labelledby="featured" className="relative mx-auto mt-8 max-w-[1400px] px-6 md:px-16">
      <h2 id="featured" className={`${headingCls} mb-4`}>Featured &amp; Recommended</h2>

      <Arrow dir="left" onClick={() => go(page - 1)} />
      <Arrow dir="right" onClick={() => go(page + 1)} />

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3"><Skeleton n={3} /></div>
      ) : (
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.ul
            key={page}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid gap-5 md:grid-cols-3"
          >
            {paginate(list, page, 3).map((m) => (
              <li key={m.id}><MovieCard movie={m} /></li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}

      <div role="group" aria-label="Featured slides" className="mt-6 flex justify-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => go(i + 1)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={page === i + 1 ? "true" : undefined}
            className={`h-2.5 w-5 rounded-full ${page === i + 1 ? "bg-white" : "bg-white/30 hover:bg-white/60"} ${interactive}`}
          />
        ))}
      </div>
    </section>
  )
}

function Browse() {
  const [page, setPage] = useState(1)
  const { movies, totalPages, loading, error } = useMovies(getTopRated, page)

  const change = (p: number) => {
    setPage(p)
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section aria-labelledby="browse" className="mx-auto mt-16 max-w-[1400px] px-6 md:px-16">
      <h2 id="browse" className={`${headingCls} mb-4`}>Top Rated</h2>
      {error && <p role="alert" className="text-red-400">{error}</p>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><Skeleton n={8} /></div>
      ) : (
        <motion.ul
          key={page}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {movies.map((m) => (
            <motion.li key={m.id} variants={item}><MovieCard movie={m} /></motion.li>
          ))}
        </motion.ul>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={change} />
    </section>
  )
}

export default function PageOne() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#3a1a12] via-[#1f0f0d] to-[#120a0a] pb-20">
      <header className="px-6 pt-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-black uppercase tracking-tight text-[#ff5a73] md:text-7xl"
        >
          Movies Bhandaar
        </motion.h1>
        <p className="mt-2 text-lg font-extrabold uppercase text-[#ff8da0]">On now thru Ab hoga movie ka jalwa</p>
      </header>
      <Featured />
      <Browse />
    </div>
  )
}