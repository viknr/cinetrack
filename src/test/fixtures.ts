import type { Movie } from '../types/movie'

export function makeMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: 'Arrival',
    year: 2016,
    genre: 'Sci-fi',
    rating: '7.9',
    runtime: '1h 56m',
    poster: 'arrival',
    tone: 'Poster for Arrival',
    status: 'watchlist',
    ...overrides,
  }
}
