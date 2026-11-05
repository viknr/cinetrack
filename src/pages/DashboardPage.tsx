import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieCard } from '../components/MovieCard'
import { featuredMovie } from '../data/movies'
import { tmdbImage } from '../services/tmdb'
import type { Movie } from '../types/movie'

type DashboardPageProps = {
  movies: Movie[]
  visibleMovies: Movie[]
  firstName: string
  averageRating: string | null
  ratingCount: number
  watchlistCount: number
  watchedCount: number
  isLoading: boolean
  error: string
  onToggleWatched: (id: number) => void
  onToggleSaved: (id: number) => void
  onAddMovie: (movie: Movie) => void
  onRetry: () => void
  onEdit: (movie: Movie) => void
  onDelete: (movie: Movie) => void
  onOpenRating: () => void
}

type FeatureSlide = { movie: Movie; description: string }

function createFeaturedSlides(movies: Movie[]): FeatureSlide[] {
  const interstellar: Movie = {
    id: 0,
    tmdbId: featuredMovie.tmdbId,
    posterPath: featuredMovie.posterPath,
    posterUrl: tmdbImage(featuredMovie.posterPath) ?? undefined,
    title: featuredMovie.title,
    year: Number(featuredMovie.year),
    genre: 'Sci-fi',
    rating: featuredMovie.rating,
    runtime: featuredMovie.runtime,
    poster: 'interstellar',
    tone: 'Poster for Interstellar',
    overview: featuredMovie.description,
    status: 'watchlist',
  }

  return [
    { movie: interstellar, description: featuredMovie.description },
    ...movies
      .filter((movie) => movie.tmdbId !== interstellar.tmdbId && movie.title !== interstellar.title)
      .map((movie) => ({ movie, description: movie.overview || `${movie.genre} pick from your collection.` })),
  ]
}

export function DashboardPage({ movies, visibleMovies, firstName, averageRating, ratingCount, watchlistCount, watchedCount, isLoading, error, onToggleWatched, onToggleSaved, onAddMovie, onRetry, onEdit, onDelete, onOpenRating }: DashboardPageProps) {
  const slides = createFeaturedSlides(movies)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const currentIndex = activeIndex % slides.length
  const currentSlide = slides[currentIndex]

  useEffect(() => {
    if (slides.length < 2 || isPaused) return
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % slides.length), 5000)
    return () => window.clearTimeout(timer)
  }, [activeIndex, isPaused, slides.length])

  function moveSlide(amount: number) {
    setActiveIndex((index) => (index + amount + slides.length) % slides.length)
  }

  return (
    <>
      <section className="feature-banner" aria-roledescription="carousel" aria-label="Featured movies">
        <div className="feature-art" aria-hidden="true"><div className="planet" /><div className="horizon" /></div>
        {currentSlide.movie.posterUrl && <img key={currentSlide.movie.tmdbId ?? currentSlide.movie.id} className="feature-poster" src={currentSlide.movie.posterUrl} alt={`${currentSlide.movie.title} poster`} />}
        <div className="feature-content">
          <div className="feature-copy" key={currentSlide.movie.tmdbId ?? currentSlide.movie.id}>
            <p className="feature-eyebrow"><span>✦</span> {currentIndex === 0 ? featuredMovie.eyebrow : 'A pick from your collection'}</p><h2>{currentSlide.movie.title}</h2><p className="feature-description">{currentSlide.description}</p><div className="feature-meta"><span>{currentSlide.movie.year}</span><span>{currentSlide.movie.genre}</span><span>{currentSlide.movie.runtime}</span><span className="feature-rating">★ {currentSlide.movie.rating}</span></div>
          </div>
          <button className="feature-button" onClick={() => onAddMovie(currentSlide.movie)}>＋ Add to watchlist</button>
          <div className="feature-controls" aria-label="Featured movie controls">
            <button onClick={() => moveSlide(-1)} aria-label="Previous movie">‹</button>
            <span aria-live="off">{currentIndex + 1} / {slides.length}</span>
            <button onClick={() => moveSlide(1)} aria-label="Next movie">›</button>
            <button onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? 'Resume movie carousel' : 'Pause movie carousel'}>{isPaused ? '▶' : 'Ⅱ'}</button>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Your movie stats">
        <article className="stat-card"><div className="stat-icon violet">▤</div><div><p>IN YOUR WATCHLIST</p><strong>{watchlistCount}</strong><span>films to look forward to</span></div><span className="stat-arrow">↗</span></article>
        <article className="stat-card"><div className="stat-icon green">✓</div><div><p>MOVIES WATCHED</p><strong>{watchedCount}</strong><span>you’re on a roll!</span></div><span className="stat-arrow">↗</span></article>
        <article className="stat-card rating-stat"><div className="stat-icon amber">★</div><div className="rating-stat-copy"><p>YOUR AVERAGE RATING</p><strong>{averageRating ?? '—'}{averageRating !== null && <span className="stat-unit">/10</span>}</strong><span>{ratingCount ? `From ${ratingCount} ${ratingCount === 1 ? 'movie' : 'movies'}, ${firstName}` : 'No personal ratings yet'}</span>{movies.length ? <button type="button" className="rating-stat-action" onClick={onOpenRating}>{ratingCount ? 'Rate movies' : 'Rate your first movie'}<span aria-hidden="true"> →</span></button> : <Link className="rating-stat-action" to="/discover">Add a movie to rate <span aria-hidden="true">→</span></Link>}</div><span className="stat-arrow">↗</span></article>
      </section>

      <section className="collection-section">
        <div className="section-heading"><div><p className="section-kicker">YOUR COLLECTION</p><h2>Picked for you</h2></div><Link className="view-all" to="/watchlist">Open your watchlist <span>↗</span></Link></div>
        {isLoading ? <div className="empty-state" role="status"><span>◌</span><h3>Loading your movies…</h3></div>
          : error ? <div className="empty-state" role="alert"><h3>Could not load your movies</h3><p>{error}</p><button className="retry-button" onClick={onRetry}>Try again</button></div>
            : visibleMovies.length > 0 ? <div className="movie-grid">{visibleMovies.slice(0, 6).map((movie) => <MovieCard key={movie.id} movie={movie} onToggleWatched={onToggleWatched} onToggleSaved={onToggleSaved} onEdit={onEdit} onDelete={onDelete} />)}</div>
              : <div className="empty-state"><span>⌕</span><h3>No films found</h3></div>}
      </section>
    </>
  )
}
