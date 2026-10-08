export interface Genre {
  id: number;
  name: string;
}

export type TmdbImageSize = "w185" | "w342" | "w500" | "w780" | "original";

export interface MovieDTO {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
}

export interface MovieDetailsType extends Omit<MovieDTO, "genre_ids"> {
  adult: boolean;
  belongs_to_collection: unknown | null;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  popularity: number;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  video: boolean;
  vote_count: number;
}

export interface MovieListResponse {
  page: number;
  results: MovieDTO[];
  total_pages: number;
  total_results: number;
}
