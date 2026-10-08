export const env = {
  tmdbKey: import.meta.env.VITE_TMDB_API_KEY as string,
}

if (!env.tmdbKey) {
  console.warn("Missing VITE_TMDB_API_KEY in .env")
}