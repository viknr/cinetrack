import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { MoviePoster } from '../components/MoviePoster'
import { RatingStars } from '../components/RatingStars'
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

  if (isLoading) return <EmptyState role="status" icon="◌" title="Loading movie details…" />
  if (error) return <EmptyState role="alert" title="Could not load your movies" description={error} action={<Link className="retry-button" to="/watchlist">Back to watchlist</Link>} />
  if (!movie) return <EmptyState icon="⌕" title="We couldn’t find that movie" description="It may have been removed from your collection." action={<Link className="retry-button" to="/watchlist">Back to watchlist</Link>} />

  return (
    <section className="movie-detail-route">
      <Link className="detail-back-link" to={movie.status === 'watched' ? '/watched' : '/watchlist'}>← Back to {movie.status === 'watched' ? 'watched movies' : 'watchlist'}</Link>
      <div className="route-detail-card">
        <MoviePoster movie={movie} className="route-detail-poster" />
        <div className="route-detail-copy"><p className="section-kicker">MOVIE DETAILS</p><h2>{movie.title}</h2><p className="detail-meta">{movie.year || 'Year unknown'} <span>·</span> {movie.runtime || 'Runtime unknown'} <span>·</span> <RatingStars className="feature-rating" value={movie.rating} label={`${movie.title} rating`} /></p><p className="detail-genre">{movie.genre || 'Genre not listed'}</p>
          <p className="detail-overview">{movie.overview || 'No synopsis is available for this movie.'}</p>
          <p className="detail-people"><strong>Director</strong>{movie.director || 'Not listed'}</p>
          <p className="detail-people"><strong>Cast</strong>{movie.cast?.join(', ') || 'Not listed'}</p>
          <button className="feature-button detail-add" onClick={() => onToggleWatched(movie.id)}>{movie.status === 'watched' ? '↩ Move to watchlist' : '✓ Mark as watched'}</button>
        </div>
      </div>
    </section>
  )
}
