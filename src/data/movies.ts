import type { Movie } from '../types/movie'

export const movies: Movie[] = [
  { id: 1, title: 'Dune: Part Two', year: 2024, genre: 'Sci-fi', rating: '8.6', runtime: '2h 46m', poster: 'dune', tone: 'Desert skies, a lone figure on a vast dune', status: 'watchlist' },
  { id: 2, title: 'Poor Things', year: 2023, genre: 'Drama', rating: '7.8', runtime: '2h 21m', poster: 'poor-things', tone: 'Dreamlike pastel city at twilight', status: 'watched' },
  { id: 3, title: 'Past Lives', year: 2023, genre: 'Romance', rating: '7.9', runtime: '1h 45m', poster: 'past-lives', tone: 'Two people beneath a glowing city sky', status: 'watchlist' },
  { id: 4, title: 'The Batman', year: 2022, genre: 'Thriller', rating: '7.8', runtime: '2h 56m', poster: 'batman', tone: 'Rainy crimson city skyline', status: 'watched' },
  { id: 5, title: 'Spider-Verse', year: 2023, genre: 'Animation', rating: '8.6', runtime: '2h 20m', poster: 'spider-verse', tone: 'Vibrant comic-book city at night', status: 'watchlist' },
  { id: 6, title: 'The Grand Budapest', year: 2014, genre: 'Comedy', rating: '8.1', runtime: '1h 39m', poster: 'budapest', tone: 'A pink grand hotel in the mountains', status: 'watched' },
]

export const featuredMovie = {
  title: 'Interstellar',
  eyebrow: 'Your next movie night',
  description: 'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.',
  year: '2014',
  genre: 'Sci-fi · Adventure',
  runtime: '2h 49m',
  rating: '8.7',
}
