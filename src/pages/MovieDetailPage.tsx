import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import { getDetails, imageUrl } from "@/api/tmdb"
import { interactive, mockPrice, ratingLabel, rupees } from "@/utils/constants"

type Details = Awaited<ReturnType<typeof getDetails>>

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const sectionTitle =
  "scroll-mt-24 border-b border-white/10 pb-2 text-xl font-bold uppercase tracking-wide text-white transition-colors duration-300 target:text-[#a4d007]"

export default function MovieDetailsPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Details | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inCart, setInCart] = useState(false)
  const [wished, setWished] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setMovie(null)
    setError(null)
    setInCart(false)
    setWished(false)
    window.scrollTo({ top: 0 })
    getDetails(Number(id), controller.signal)
      .then(setMovie)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message)
      })
    return () => controller.abort()
  }, [id])

  if (error) return <p role="alert" className="min-h-screen bg-[#120a0a] p-28 text-red-400">{error}</p>
  if (!movie) return <div className="h-screen animate-pulse bg-[#1f0f0d]" />

  const { price, original, discount } = mockPrice(movie.id)
  const hours = Math.floor((movie.runtime ?? 0) / 60)
  const mins = (movie.runtime ?? 0) % 60
  const released = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "TBA"
  return (
    <article className="relative min-h-screen overflow-hidden bg-[#120a0a] pb-20">
      {/* blurred backdrop */}
      <div className="absolute inset-x-0 top-0 h-[80vh]" aria-hidden="true">
        <img
          src={imageUrl(movie.backdrop_path ?? movie.poster_path, "w780")}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#120a0a]/30 via-[#120a0a]/80 to-[#120a0a]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-6xl px-6 pt-24"
      >
        <motion.div variants={item}>
          <Link
            to="/browse"
            className="rounded text-sm text-[#66c0f4] underline-offset-2 transition hover:text-white hover:underline active:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"
          >
            ← Back to browse
          </Link>
          <h1 className="mt-3 text-4xl font-extrabold text-white md:text-5xl">{movie.title}</h1>
          {movie.tagline && <p className="mt-1 italic text-[#8f98a0]">{movie.tagline}</p>}
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_324px]">
          {/* left: big image + purchase box */}
          <motion.div variants={item} className="space-y-6">
            <img
              src={imageUrl(movie.backdrop_path ?? movie.poster_path, "w780")}
              alt={`${movie.title} backdrop`}
              className="aspect-video w-full rounded-sm object-cover shadow-2xl"
            />

            {/* focus-within: border turns green while anything inside has focus */}
            <section
              aria-label="Purchase"
              className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-transparent bg-[#2a1712] p-5 transition-colors duration-200 hover:border-white/10 focus-within:border-[#a4d007]"
            >
              <div>
                <h2 className="text-lg font-semibold text-white">Buy {movie.title}</h2>
                <p className="text-sm text-[#8f98a0]">Mock price for the demo</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-stretch text-sm">
                  <span className="bg-[#a4d007] px-2 py-1.5 text-lg font-bold text-black">-{discount}%</span>
                  <span className="flex items-center gap-2 bg-black/60 px-3 text-white">
                    <s className="text-xs text-white/50">{rupees(original)}</s>
                    <span className="text-lg">{rupees(price)}</span>
                  </span>
                </div>
                <button
                  type="button"
                  aria-pressed={inCart}
                  onClick={() => setInCart((v) => !v)}
                  className={`rounded-sm bg-linear-to-b from-[#75b022] to-[#588a1b] px-6 py-2.5 font-medium text-[#d2efa9] ${interactive}`}
                >
                  {inCart ? "In Cart ✓" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  aria-pressed={wished}
                  onClick={() => setWished((v) => !v)}
                  className={`rounded-sm bg-white/10 px-4 py-2.5 text-sm font-medium text-[#b8b6b4] ${interactive}`}
                >
                  {wished ? "♥ Wishlisted" : "♡ Wishlist"}
                </button>
              </div>
            </section>
          </motion.div>

          {/* right: poster and quick facts */}
          <motion.aside variants={item} className="space-y-4">
            <img
              src={imageUrl(movie.poster_path, "w500")}
              alt={`${movie.title} poster`}
              className="mx-auto w-48 rounded-sm shadow-xl lg:w-full"
            />
            <p className="line-clamp-5 text-sm leading-relaxed text-[#c6d4df]">{movie.overview}</p>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-[#8f98a0]">Reviews</dt>
                <dd>
                  <span className="text-[#66c0f4]">{ratingLabel(movie.vote_average)}</span>{" "}
                  <span className="text-white/60">({(movie.vote_count ?? 0).toLocaleString("en-IN")})</span>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-[#8f98a0]">Release date</dt>
                <dd className="text-[#c6d4df]">{released}</dd>
              </div>
            </dl>
            <ul className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <li key={g.id} className="rounded-sm bg-[#7b3f30] px-2 py-1 text-xs text-[#e8cfc6]">
                  {g.name}
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>

        <motion.section variants={item} aria-labelledby="about" className="mt-6 max-w-3xl">
          <h2 id="about" className={sectionTitle}>About this movie</h2>
          <p className="mt-4 leading-relaxed text-[#c6d4df]">{movie.overview || "No description available."}</p>
        </motion.section>

        <motion.section variants={item} aria-labelledby="details" className="mt-10 max-w-3xl">
          <h2 id="details" className={sectionTitle}>Details</h2>
          <dl className="mt-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
            <dt className="text-[#8f98a0]">Release date</dt>
            <dd className="text-[#c6d4df]">{released}</dd>
            {movie.runtime > 0 && (
              <>
                <dt className="text-[#8f98a0]">Runtime</dt>
                <dd className="text-[#c6d4df]">{hours}h {mins}m</dd>
              </>
            )}
            <dt className="text-[#8f98a0]">Rating</dt>
            <dd className="text-[#c6d4df]">★ {movie.vote_average.toFixed(1)} / 10</dd>
            <dt className="text-[#8f98a0]">Genres</dt>
            <dd className="text-[#c6d4df]">{movie.genres.map((g) => g.name).join(", ") || "N/A"}</dd>
          </dl>
        </motion.section>
      </motion.div>
    </article>
  )
}