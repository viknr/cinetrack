import type { Movie } from '../types/movie'
import { Link } from 'react-router-dom'
import { MoviePoster } from './MoviePoster'
import { RatingStars } from './RatingStars'

type MovieCardProps = {
  movie: Movie
  onToggleWatched: (id: number) => void
  onToggleSaved: (id: number) => void
  onEdit: (movie: Movie) => void
  onDelete: (movie: Movie) => void
}

export function MovieCard({ movie, onToggleWatched, onToggleSaved, onEdit, onDelete }: MovieCardProps) {
  return (
    <article className="movie-card">
      <MoviePoster movie={movie}>
        <span className="poster-tag">{movie.genre}</span>
        <button className={`save-button ${movie.status === 'watchlist' ? 'saved' : ''}`} aria-label={movie.status === 'watchlist' ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`} onClick={() => onToggleSaved(movie.id)}>{movie.status === 'watchlist' ? '♥' : '♡'}</button>
        <span className="poster-title">{movie.title}</span>
      </MoviePoster>
      <div className="movie-info"><div><h3>{movie.title}</h3><p>{movie.year} <span>·</span> {movie.runtime}</p></div><RatingStars value={movie.rating} label={`${movie.title} TMDB rating`} className="rating" /></div>
      <button className="watched-toggle" onClick={() => onToggleWatched(movie.id)}>{movie.status === 'watched' ? '✓ Watched' : '+ Mark as watched'}</button>
      <Link className="movie-detail-link" to={`/movies/${movie.id}`}>View details <span aria-hidden="true">↗</span></Link>
      <div className="movie-management"><button onClick={() => onEdit(movie)}>Edit</button><button onClick={() => onDelete(movie)}>Delete</button></div>
    </article>
  )
}
