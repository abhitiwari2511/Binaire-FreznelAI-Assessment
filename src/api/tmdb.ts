import { apiGet } from "./ApiClient"

import type { MovieDTO, MovieListResponse } from "@/types/tmdb"

const IMG = "https://image.tmdb.org/t/p"

export const getPopular = (page = 1, signal?: AbortSignal) =>
  apiGet<MovieListResponse>("/movie/popular", { page }, signal)

export const getTopRated = (page = 1, signal?: AbortSignal) =>
  apiGet<MovieListResponse>("/movie/top_rated", { page }, signal)

export const searchMovies = (query: string, page = 1, signal?: AbortSignal) =>
  apiGet<MovieListResponse>("/search/movie", { query, page }, signal)

export const getDetails = (id: number, signal?: AbortSignal) =>
  apiGet<MovieDTO & { genres: { id: number; name: string }[] }>(`/movie/${id}`, {}, signal)

export const imageUrl = (
  path: string | null,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w500"
) => (path ? `${IMG}/${size}${path}` : "/placeholder.svg")