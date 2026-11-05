import { Link } from 'react-router-dom'
import { MovieCard } from '../components/MovieCard'
import type { Movie } from '../types/movie'

type CollectionPageProps = {
  title: string
  movies: Movie[]
  isLoading: boolean
  error: string
  onToggleWatched: (id: number) => void
  onToggleSaved: (id: number) => void
  onRetry: () => void
  onEdit: (movie: Movie) => void
  onDelete: (movie: Movie) => void
}

export function CollectionPage({ title, movies, isLoading, error, onToggleWatched, onToggleSaved, onRetry, onEdit, onDelete }: CollectionPageProps) {
  return (
    <section className="collection-section route-collection">
      <div className="section-heading"><div><p className="section-kicker">YOUR COLLECTION</p><h2>{title}</h2></div><div className="section-actions"><span className="movie-count">{movies.length} films</span><Link className="view-all" to="/">Back to dashboard <span>↗</span></Link></div></div>
      {isLoading ? <div className="empty-state" role="status"><span>◌</span><h3>Loading your movies…</h3></div>
        : error ? <div className="empty-state" role="alert"><h3>Could not load your movies</h3><p>{error}</p><button className="retry-button" onClick={onRetry}>Try again</button></div>
          : movies.length > 0 ? <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} onToggleWatched={onToggleWatched} onToggleSaved={onToggleSaved} onEdit={onEdit} onDelete={onDelete} />)}</div>
            : <div className="empty-state"><span>⌕</span><h3>No films here yet</h3><p>Discover a movie and add it to your collection.</p><Link className="retry-button" to="/discover">Explore movies</Link></div>}
    </section>
  )
}
