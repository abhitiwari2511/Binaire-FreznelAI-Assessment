import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, type Variants } from "framer-motion"
import { getPopular, searchMovies } from "@/api/tmdb"
import { useMovies } from "@/hooks/useMovies"
import { Pagination } from "@/components/common/Pagination"
import { interactive } from "@/utils/constants"
import { MovieCard } from "@/components/common/MovieCard"

type Sort = "popular" | "rating" | "newest"

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function BrowsePage() {
  const [input, setInput] = useState("")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>("popular")
  const [page, setPage] = useState(1)

  //debounce- reduce unwanted api calls
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(input.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [input])

  const fetcher = useCallback(
    (p: number, signal: AbortSignal) =>
      query ? searchMovies(query, p, signal) : getPopular(p, signal),
    [query]
  )
  const { movies, totalPages, loading, error } = useMovies(fetcher, page)

  const sorted = useMemo(() => {
    const list = [...movies]
    if (sort === "rating") list.sort((a, b) => b.vote_average - a.vote_average)
    if (sort === "newest") list.sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
    return list
  }, [movies, sort])

  const change = (p: number) => {
    setPage(p)
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#3a1a12] via-[#1f0f0d] to-[#120a0a] pb-20">
      <a
        href="#results"
        className="sr-only rounded-sm bg-[#a4d007] px-3 py-2 font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-50"
      >
        Skip to results
      </a>

      <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-16">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-black uppercase tracking-tight text-[#ff5a73]"
        >
          Browse
        </motion.h1>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex min-w-60 max-w-md flex-1 items-center gap-2 rounded-sm border border-[#3c4048] bg-[#32353c] px-3 transition-colors duration-200 hover:border-[#5a5f69] focus-within:border-[#66c0f4] focus-within:bg-[#383c44]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8f98a0" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search movies…"
              aria-label="Search movies"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent py-2.5 text-white placeholder:text-[#8f98a0] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                aria-label="Clear search"
                className="rounded px-1.5 text-[#8f98a0] transition hover:text-white active:scale-90 focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"
              >
                ✕
              </button>
            )}
          </div>

          <select
            aria-label="Sort movies"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={`rounded-sm border border-[#3c4048] bg-[#32353c] px-3 py-2.5 text-sm text-white hover:border-[#5a5f69] focus:border-[#66c0f4] ${interactive}`}
          >
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <h2
          id="results"
          className="mb-4 mt-10 scroll-mt-24 text-2xl font-bold uppercase tracking-wide text-white transition-colors duration-300 target:text-[#a4d007]"
        >
          {query ? `Results for “${query}”` : "Popular movies"}
        </h2>

        {error && <p role="alert" className="text-red-400">{error}</p>}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-white/5" />
            ))}
          </div>
        ) : sorted.length === 0 && !error ? (
          <p className="mt-16 text-center text-lg text-[#8f98a0]">No movies found. Try another search.</p>
        ) : (
          <motion.ul
            key={`${query}-${page}-${sort}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {sorted.map((m) => (
              <motion.li key={m.id} variants={item}>
                <MovieCard movie={m} />
              </motion.li>
            ))}
          </motion.ul>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={change} />}
      </div>
    </div>
  )
}