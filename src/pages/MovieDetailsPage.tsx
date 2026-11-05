import { Link, useParams } from 'react-router-dom'
import type { Movie } from '../types/movie'

type MovieDetailsPageProps = {
  movies: Movie[]
  isLoading: boolean
  error: string
  onToggleWatched: (id: number) => void
}

export function MovieDetailsPage({ movies, isLoading, error, onToggleWatched }: MovieDetailsPageProps) {
  const { movieId } = useParams<{ movieId: string }>()
  const movie = movies.find((item) => item.id === Number(movieId))

  if (isLoading) return <div className="empty-state" role="status"><span>◌</span><h3>Loading movie details…</h3></div>
  if (error) return <div className="empty-state" role="alert"><h3>Could not load your movies</h3><p>{error}</p><Link className="retry-button" to="/">Return to dashboard</Link></div>
  if (!movie) return <div className="empty-state"><span>⌕</span><h3>We couldn’t find that movie</h3><p>It may have been removed from your collection.</p><Link className="retry-button" to="/watchlist">Back to watchlist</Link></div>

  return (
    <section className="movie-detail-route">
      <Link className="detail-back-link" to={movie.status === 'watched' ? '/watched' : '/watchlist'}>← Back to {movie.status === 'watched' ? 'watched movies' : 'watchlist'}</Link>
      <div className="route-detail-card">
        <div className={`poster poster-${movie.poster} route-detail-poster ${movie.posterUrl ? 'poster-with-image' : ''}`} style={movie.posterUrl ? { backgroundImage: `linear-gradient(0deg,#0d0b13 1%,transparent 65%),url("${movie.posterUrl}")` } : undefined} role="img" aria-label={movie.tone}>
          {!movie.posterUrl && <span className="poster-title">{movie.title}</span>}
        </div>
        <div className="route-detail-copy"><p className="section-kicker">MOVIE DETAILS</p><h2>{movie.title}</h2><p className="detail-meta">{movie.year || 'Year unknown'} <span>·</span> {movie.runtime} <span>·</span> <span className="feature-rating">★ {movie.rating}</span></p><p className="detail-genre">{movie.genre}</p>
          <p className="detail-overview">{movie.overview || 'This starter catalogue entry does not include a synopsis yet. Use Discover to find a TMDB movie with full details.'}</p>
          <p className="detail-people"><strong>Director</strong>{movie.director || 'Not included in the starter catalogue'}</p>
          <p className="detail-people"><strong>Cast</strong>{movie.cast?.join(', ') || 'Not included in the starter catalogue'}</p>
          <button className="feature-button detail-add" onClick={() => onToggleWatched(movie.id)}>{movie.status === 'watched' ? '↩ Move to watchlist' : '✓ Mark as watched'}</button>
        </div>
      </div>
    </section>
  )
}
