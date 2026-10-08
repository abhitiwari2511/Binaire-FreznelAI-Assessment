import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { imageUrl } from "@/api/tmdb"
import { GENRES, interactive, mockPrice, ratingLabel, rupees } from "@/utils/constants"
import type { MovieDTO } from "@/types/tmdb"

const spring = { type: "spring", stiffness: 260, damping: 28 } as const

export function MovieCard({ movie }: { movie: MovieDTO }) {
  const [open, setOpen] = useState(false)
  const [inCart, setInCart] = useState(false)
  const { price, original, discount } = mockPrice(movie.id)
  const tags = (movie.genre_ids ?? []).map((id) => GENRES[id]).filter(Boolean).slice(0, 4)

  return (
    <article
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      className="relative aspect-[4/5] overflow-hidden bg-[#2a1712] shadow-lg transition-[transform,box-shadow] duration-150 hover:shadow-2xl focus-within:z-20 focus-within:shadow-[0_0_0_2px_#66c0f4] active:scale-[0.985]"
    >
  
      <Link
        to={`/movie/${movie.id}`}
        aria-label={`${movie.title}, view details`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#66c0f4]"
      />

      {/* image shrink upar on hover */}
      <motion.div
        className="absolute inset-x-0 top-0 overflow-hidden"
        initial={false}
        animate={{ height: open ? "46%" : "100%" }}
        transition={spring}
      >
        <motion.img
          src={imageUrl(movie.poster_path, "w500")}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
          initial={false}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />
        <motion.img
          src={imageUrl(movie.backdrop_path ?? movie.poster_path, "w780")}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 1.15 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[54%] flex-col gap-2 bg-[#5a2e22] p-4"
        initial={false}
        animate={{ y: open ? "0%" : "100%" }}
        transition={spring}
      >
        <h3 className="truncate text-xl font-semibold text-white">{movie.title}</h3>
        <p className="text-sm">
          <span className="text-[#66c0f4]">{ratingLabel(movie.vote_average)}</span>{" "}
          <span className="text-white/60">({(movie.vote_count ?? 0).toLocaleString("en-IN")})</span>
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li key={t} className="rounded-sm bg-[#7b3f30] px-2 py-1 text-xs text-[#e8cfc6]">{t}</li>
          ))}
        </ul>
        <button
          type="button"
          aria-pressed={inCart}
          onClick={() => setInCart((v) => !v)}
          className={`pointer-events-auto mt-auto w-fit rounded-sm bg-linear-to-b from-[#75b022] to-[#588a1b] px-5 py-2 text-sm font-medium text-[#d2efa9] ${interactive}`}
        >
          {inCart ? "In Cart ✓" : "Add to Cart"}
        </button>
      </motion.div>

{/* demo price mockup */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-30 flex items-stretch text-sm">
        <span className="bg-[#a4d007] px-2 py-1 text-lg font-bold text-black">-{discount}%</span>
        <span className="flex items-center gap-2 bg-black/75 px-2 text-white">
          <s className="text-xs text-white/50">{rupees(original)}</s>
          <span className="text-base">{rupees(price)}</span>
        </span>
      </div>
    </article>
  )
}