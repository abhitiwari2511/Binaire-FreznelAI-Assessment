export const GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
}

// shared animation classes card ke liye
export const interactive =
  "cursor-pointer transition duration-150 hover:brightness-110 active:scale-95 active:brightness-90 " +
  "focus:outline-none focus:brightness-110 focus-visible:ring-2 focus-visible:ring-[#66c0f4] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b0f0f]"

export const ratingLabel = (v: number) =>
  v >= 8 ? "Overwhelmingly Positive"
  : v >= 7 ? "Very Positive"
  : v >= 6 ? "Mostly Positive"
  : v >= 5 ? "Mixed"
  : "Mostly Negative"

// tmdb fake prices
export function mockPrice(id: number) {
  const original = 299 + (id % 45) * 100
  const discount = [20, 30, 40, 50, 60][id % 5]
  const price = Math.round(original * (1 - discount / 100))
  return { original, price, discount }
}

export const rupees = (n: number) => `₹ ${n.toLocaleString("en-IN")}`