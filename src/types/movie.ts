export type Movie = {
  id: number
  title: string
  year: number
  genre: string
  rating: string
  userRating?: number
  runtime: string
  poster: string
  tone: string
  status: 'watchlist' | 'watched'
  tmdbId?: number
  posterPath?: string
  posterUrl?: string
  overview?: string
  director?: string
  cast?: string[]
}
