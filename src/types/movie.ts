export type Movie = {
  id: number
  title: string
  year: number
  genre: string
  rating: string
  runtime: string
  poster: string
  tone: string
  status: 'watchlist' | 'watched'
}
