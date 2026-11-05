import type { Movie } from '../types/movie'

type MovieCardProps = {
  movie: Movie
  onToggleWatched: (id: number) => void
  onToggleSaved: (id: number) => void
}

export function MovieCard({ movie, onToggleWatched, onToggleSaved }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className={`poster poster-${movie.poster}`} role="img" aria-label={movie.tone}>
        <span className="poster-tag">{movie.genre}</span>
        <button className={`save-button ${movie.status === 'watchlist' ? 'saved' : ''}`} aria-label={movie.status === 'watchlist' ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`} onClick={() => onToggleSaved(movie.id)}>{movie.status === 'watchlist' ? '♥' : '♡'}</button>
        <span className="poster-title">{movie.title}</span>
      </div>
      <div className="movie-info"><div><h3>{movie.title}</h3><p>{movie.year} <span>·</span> {movie.runtime}</p></div><span className="rating">★ {movie.rating}</span></div>
      <button className="watched-toggle" onClick={() => onToggleWatched(movie.id)}>{movie.status === 'watched' ? '✓ Watched' : '+ Mark as watched'}</button>
    </article>
  )
}
