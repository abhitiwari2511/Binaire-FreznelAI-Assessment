import { useEffect, useState } from "react"
import type { MovieDTO, MovieListResponse } from "@/types/tmdb"

type Fetcher = (page: number, signal: AbortSignal) => Promise<MovieListResponse>

export function useMovies(fetcher: Fetcher, page: number) {
  const [movies, setMovies] = useState<MovieDTO[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetcher(page, controller.signal)
      .then((data) => {
        setMovies(data.results)
        setTotalPages(Math.min(data.total_pages, 500))
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [fetcher, page])

  return { movies, totalPages, loading, error }
}