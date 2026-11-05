import { create } from 'zustand'
import type { Movie } from '../types/movie'

const legacyCollectionStorageKey = 'cinetrack-movies'

export function getCollectionStorageKey(userId: string) {
  return `${legacyCollectionStorageKey}:${encodeURIComponent(userId)}`
}

type MovieStore = {
  activeUserId: string | null
  movies: Movie[]
  isLoadingCatalogue: boolean
  catalogueError: string
  setActiveUser: (userId: string | null) => void
  setMovies: (movies: Movie[]) => void
  setIsLoadingCatalogue: (isLoading: boolean) => void
  setCatalogueError: (error: string) => void
  toggleWatched: (id: number) => void
  addMovie: (movie: Movie) => void
  updateMovie: (id: number, updates: Partial<Movie>) => void
  rateMovie: (id: number, rating: number) => void
  deleteMovie: (id: number) => void
}

function saveMovies(userId: string | null, movies: Movie[]) {
  if (!userId) return
  window.localStorage.setItem(getCollectionStorageKey(userId), JSON.stringify(movies))
}

function updateAndSave(update: (movies: Movie[]) => Movie[], set: (state: Partial<MovieStore>) => void, get: () => MovieStore) {
  const { movies: currentMovies, activeUserId } = get()
  const movies = update(currentMovies)
  saveMovies(activeUserId, movies)
  set({ movies })
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  activeUserId: null,
  movies: [],
  isLoadingCatalogue: true,
  catalogueError: '',

  setActiveUser: (activeUserId) => {
    if (get().activeUserId !== activeUserId) set({ activeUserId, movies: [] })
  },
  setMovies: (movies) => {
    saveMovies(get().activeUserId, movies)
    set({ movies })
  },
  setIsLoadingCatalogue: (isLoadingCatalogue) => set({ isLoadingCatalogue }),
  setCatalogueError: (catalogueError) => set({ catalogueError }),

  toggleWatched: (id) => updateAndSave((movies) => movies.map((movie) => movie.id === id
    ? { ...movie, status: movie.status === 'watched' ? 'watchlist' : 'watched' }
    : movie), set, get),
  addMovie: (movie) => updateAndSave((movies) => [...movies, movie], set, get),
  updateMovie: (id, updates) => updateAndSave((movies) => movies.map((movie) => movie.id === id ? { ...movie, ...updates, id } : movie), set, get),
  rateMovie: (id, rating) => updateAndSave((movies) => movies.map((movie) => movie.id === id ? { ...movie, userRating: rating } : movie), set, get),
  deleteMovie: (id) => updateAndSave((movies) => movies.filter((movie) => movie.id !== id), set, get),
}))
