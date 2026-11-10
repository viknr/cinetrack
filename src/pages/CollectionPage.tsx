import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { MovieCard } from '../components/MovieCard'
import { SectionHeading } from '../components/SectionHeading'
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
      <SectionHeading kicker="YOUR COLLECTION" title={title} action={<><span className="movie-count">{movies.length} films</span><Link className="view-all" to="/">Back to dashboard <span>↗</span></Link></>} />
      {isLoading ? <EmptyState role="status" icon="◌" title="Loading your movies…" />
        : error ? <EmptyState role="alert" title="Could not load your movies" description={error} action={<button className="retry-button" onClick={onRetry}>Try again</button>} />
          : movies.length > 0 ? <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} onToggleWatched={onToggleWatched} onToggleSaved={onToggleSaved} onEdit={onEdit} onDelete={onDelete} />)}</div>
            : <EmptyState icon="⌕" title="No films here yet" description="Discover a movie and add it to your collection." action={<Link className="retry-button" to="/discover">Explore movies</Link>} />}
    </section>
  )
}
