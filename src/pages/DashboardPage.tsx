import { Link } from 'react-router-dom'
import { MovieCard } from '../components/MovieCard'
import { featuredMovie } from '../data/movies'
import type { Movie } from '../types/movie'

type DashboardPageProps = {
  movies: Movie[]
  watchlistCount: number
  watchedCount: number
  isLoading: boolean
  error: string
  onToggleWatched: (id: number) => void
  onToggleSaved: (id: number) => void
  onAddFeatured: () => void
  onRetry: () => void
}

export function DashboardPage({ movies, watchlistCount, watchedCount, isLoading, error, onToggleWatched, onToggleSaved, onAddFeatured, onRetry }: DashboardPageProps) {
  return (
    <>
      <section className="feature-banner" aria-label={`Featured movie: ${featuredMovie.title}`}>
        <div className="feature-art" aria-hidden="true"><div className="planet" /><div className="horizon" /><span className="astronaut">◌</span></div>
        <div className="feature-content"><p className="feature-eyebrow"><span>✦</span> {featuredMovie.eyebrow}</p><h2>{featuredMovie.title}</h2><p className="feature-description">{featuredMovie.description}</p><div className="feature-meta"><span>{featuredMovie.year}</span><span>{featuredMovie.genre}</span><span>{featuredMovie.runtime}</span><span className="feature-rating">★ {featuredMovie.rating}</span></div><button className="feature-button" onClick={onAddFeatured}>＋ Add to watchlist</button></div>
        <span className="feature-side-label">CINEPICK&nbsp; / &nbsp;01</span>
      </section>

      <section className="stats-grid" aria-label="Your movie stats">
        <article className="stat-card"><div className="stat-icon violet">▤</div><div><p>IN YOUR WATCHLIST</p><strong>{watchlistCount}</strong><span>films to look forward to</span></div><span className="stat-arrow">↗</span></article>
        <article className="stat-card"><div className="stat-icon green">✓</div><div><p>MOVIES WATCHED</p><strong>{watchedCount}</strong><span>you’re on a roll!</span></div><span className="stat-arrow">↗</span></article>
        <article className="stat-card"><div className="stat-icon amber">★</div><div><p>YOUR AVERAGE RATING</p><strong>8.2<span className="stat-unit">/10</span></strong><span>excellent taste, Alex</span></div><span className="stat-arrow">↗</span></article>
      </section>

      <section className="collection-section">
        <div className="section-heading"><div><p className="section-kicker">YOUR COLLECTION</p><h2>Picked for you</h2></div><Link className="view-all" to="/watchlist">Open your watchlist <span>↗</span></Link></div>
        {isLoading ? <div className="empty-state" role="status"><span>◌</span><h3>Loading your movies…</h3></div>
          : error ? <div className="empty-state" role="alert"><h3>Could not load your movies</h3><p>{error}</p><button className="retry-button" onClick={onRetry}>Try again</button></div>
            : movies.length > 0 ? <div className="movie-grid">{movies.slice(0, 6).map((movie) => <MovieCard key={movie.id} movie={movie} onToggleWatched={onToggleWatched} onToggleSaved={onToggleSaved} />)}</div>
              : <div className="empty-state"><span>⌕</span><h3>Your collection is empty</h3></div>}
      </section>
    </>
  )
}
