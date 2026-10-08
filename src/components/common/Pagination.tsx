import { getPageRange } from "@/utils/pagination"
import { interactive } from "@/utils/constants"

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: Props) {
  const base = `grid h-10 min-w-10 place-items-center text-white rounded-sm px-3 text-sm font-medium disabled:pointer-events-none disabled:opacity-40 ${interactive}`

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button className={`${base} bg-white/10`} onClick={() => onChange(page - 1)} disabled={page === 1}>
        ‹ Prev
      </button>

      {getPageRange(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`dots-${i}`} aria-hidden="true" className="px-1 text-white">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`${base} ${item === page ? "bg-[#a4d007] font-bold" : "bg-white/10 hover:bg-white/20"}`}
          >
            {item}
          </button>
        )
      )}

      <button className={`${base} bg-white/10`} onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next ›
      </button>
    </nav>
  )
}