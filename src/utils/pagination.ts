export type PageItem = number | "…"

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

export function getPageRange(page: number, total: number, siblings = 1): PageItem[] {
  const slots = siblings * 2 + 5
  if (total <= slots) return range(1, total)

  const left = Math.max(page - siblings, 1)
  const right = Math.min(page + siblings, total)
  const dotsLeft = left > 2
  const edge = 3 + siblings * 2
  const dotsRight = right < total - 2

  if (!dotsLeft && dotsRight) return [...
    range(1, edge), "…", total]
  if (dotsLeft && !dotsRight) return [1, "…", ...range(total - edge + 1, total)]
  return [1, "…", ...range(left, right), "…", total]
}

export const paginate = <T,>(items: T[], page: number, size: number) =>
  items.slice((page - 1) * size, page * size)

export const countPages = (count: number, size: number) =>
  Math.max(1, Math.ceil(count / size))