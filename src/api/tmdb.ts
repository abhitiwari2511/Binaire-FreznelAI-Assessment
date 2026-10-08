import { apiGet } from "./ApiClient";

import type {
  MovieDetailsType,
  MovieListResponse,
  TmdbImageSize,
} from "@/types/tmdb";

const IMG = "https://image.tmdb.org/t/p";

export const getPopular = (page = 1, signal?: AbortSignal) =>
  apiGet<MovieListResponse>("/movie/popular", { page }, signal);

export const getTopRated = (page = 1, signal?: AbortSignal) =>
  apiGet<MovieListResponse>("/movie/top_rated", { page }, signal);

export const searchMovies = (query: string, page = 1, signal?: AbortSignal) =>
  apiGet<MovieListResponse>("/search/movie", { query, page }, signal);

export const getDetails = (
  id: number,
  signal?: AbortSignal,
): Promise<MovieDetailsType> =>
  apiGet<MovieDetailsType>(`/movie/${id}`, {}, signal);

export const imageUrl = (
  path: string | null,
  size: TmdbImageSize = "w500",
): string => (path ? `${IMG}/${size}${path}` : "/placeholder.svg");
