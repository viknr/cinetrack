export type TMDBMovieResult = {
  id: number
  title: string
  release_date: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
}

export type TMDBPerson = { id: number; name: string; character?: string; job?: string }

export type TMDBMovieDetails = TMDBMovieResult & {
  runtime: number | null
  genres: { id: number; name: string }[]
  credits: { cast: TMDBPerson[]; crew: TMDBPerson[] }
}

type TMDBSearchResponse = { results: TMDBMovieResult[] }

const API_BASE = 'https://api.themoviedb.org/3'

async function tmdbRequest<T>(path: string): Promise<T> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_KEY_MISSING')

  const url = new URL(`${API_BASE}${path}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', 'en-US')

  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 401) throw new Error('TMDB_KEY_INVALID')
    throw new Error(`TMDB_REQUEST_FAILED_${response.status}`)
  }
  return response.json() as Promise<T>
}

export function searchTMDBMovies(query: string) {
  const params = new URLSearchParams({ query, include_adult: 'false' })
  return tmdbRequest<TMDBSearchResponse>(`/search/movie?${params}`).then((data) => data.results)
}

export function getTMDBMovieDetails(movieId: number) {
  return tmdbRequest<TMDBMovieDetails>(`/movie/${movieId}?append_to_response=credits`)
}

export function tmdbImage(path: string | null, size: 'w342' | 'w500' | 'w1280' = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
}
