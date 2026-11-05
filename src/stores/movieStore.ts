import { create } from 'zustand'
import type { Movie } from '../types/movie'

const collectionStorageKey = 'cinetrack-movies'

type MovieStore = {
  movies: Movie[]
  isLoadingCatalogue: boolean
  catalogueError: string
  setMovies: (movies: Movie[]) => void
  setIsLoadingCatalogue: (isLoading: boolean) => void
  setCatalogueError: (error: string) => void
  toggleWatched: (id: number) => void
  addMovie: (movie: Movie) => void
  updateMovie: (id: number, updates: Partial<Movie>) => void
  deleteMovie: (id: number) => void
}

function saveMovies(movies: Movie[]) {
  window.localStorage.setItem(collectionStorageKey, JSON.stringify(movies))
}

function updateAndSave(update: (movies: Movie[]) => Movie[], set: (state: Partial<MovieStore>) => void, get: () => MovieStore) {
  const movies = update(get().movies)
  saveMovies(movies)
  set({ movies })
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  isLoadingCatalogue: true,
  catalogueError: '',

  setMovies: (movies) => {
    saveMovies(movies)
    set({ movies })
  },
  setIsLoadingCatalogue: (isLoadingCatalogue) => set({ isLoadingCatalogue }),
  setCatalogueError: (catalogueError) => set({ catalogueError }),

  toggleWatched: (id) => updateAndSave((movies) => movies.map((movie) => movie.id === id
    ? { ...movie, status: movie.status === 'watched' ? 'watchlist' : 'watched' }
    : movie), set, get),
  addMovie: (movie) => updateAndSave((movies) => [...movies, movie], set, get),
  updateMovie: (id, updates) => updateAndSave((movies) => movies.map((movie) => movie.id === id ? { ...movie, ...updates, id } : movie), set, get),
  deleteMovie: (id) => updateAndSave((movies) => movies.filter((movie) => movie.id !== id), set, get),
}))
