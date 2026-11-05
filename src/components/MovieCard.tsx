import type { Movie } from '../types/movie'
import { Link } from 'react-router-dom'

type MovieCardProps = {
  movie: Movie
  onToggleWatched: (id: number) => void
  onToggleSaved: (id: number) => void
}

export function MovieCard({ movie, onToggleWatched, onToggleSaved }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className={`poster poster-${movie.poster} ${movie.posterUrl ? 'poster-with-image' : ''}`} style={movie.posterUrl ? { backgroundImage: `linear-gradient(0deg,#0d0b13 1%,transparent 65%),url("${movie.posterUrl}")` } : undefined} role="img" aria-label={movie.tone}>
        <span className="poster-tag">{movie.genre}</span>
        <button className={`save-button ${movie.status === 'watchlist' ? 'saved' : ''}`} aria-label={movie.status === 'watchlist' ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`} onClick={() => onToggleSaved(movie.id)}>{movie.status === 'watchlist' ? '♥' : '♡'}</button>
        <span className="poster-title">{movie.title}</span>
      </div>
      <div className="movie-info"><div><h3>{movie.title}</h3><p>{movie.year} <span>·</span> {movie.runtime}</p></div><span className="rating">★ {movie.rating}</span></div>
      <button className="watched-toggle" onClick={() => onToggleWatched(movie.id)}>{movie.status === 'watched' ? '✓ Watched' : '+ Mark as watched'}</button>
      <Link className="movie-detail-link" to={`/movies/${movie.id}`}>View details <span aria-hidden="true">↗</span></Link>
    </article>
  )
}
