import type { Movie } from '../types/movie'

export async function fetchMovieCatalogue(): Promise<Movie[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/movies.json`)
  if (!response.ok) {
    throw new Error('We could not load the movie catalogue. Please try again.')
  }

  const movies = await response.json() as Movie[]
  if (!Array.isArray(movies)) {
    throw new Error('The movie catalogue has an unexpected format.')
  }

  return movies
}
