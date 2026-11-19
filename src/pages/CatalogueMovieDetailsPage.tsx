import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { MoviePoster } from '../components/MoviePoster'
import { RatingStars } from '../components/RatingStars'
import type { Movie } from '../types/movie'

type CatalogueMovieDetailsPageProps = {
  catalogue: Movie[]
  collection: Movie[]
  isLoading: boolean
  error: string
  onAddMovie: (movie: Movie) => void
}

export function CatalogueMovieDetailsPage({ catalogue, collection, isLoading, error, onAddMovie }: CatalogueMovieDetailsPageProps) {
  const { catalogueMovieId } = useParams<{ catalogueMovieId: string }>()
  const movie = catalogue.find((item) => item.id === Number(catalogueMovieId))
  const isInCollection = movie && collection.some((item) => movie.tmdbId && item.tmdbId
    ? item.tmdbId === movie.tmdbId
    : item.title.toLowerCase() === movie.title.toLowerCase() && item.year === movie.year)

  if (isLoading) return <EmptyState role="status" icon="◌" title="Loading movie details…" />
  if (error) return <EmptyState role="alert" title="Could not load movie details" description={error} action={<Link className="retry-button" to="/discover">Back to Discover</Link>} />
  if (!movie) return <EmptyState icon="⌕" title="We couldn’t find that movie" description="It may have been removed from the local catalogue." action={<Link className="retry-button" to="/discover">Back to Discover</Link>} />

  return (
    <section className="movie-detail-route">
      <Link className="detail-back-link" to="/discover">← Back to Discover</Link>
      <div className="route-detail-card">
        <MoviePoster movie={movie} className="route-detail-poster" />
        <div className="route-detail-copy">
          <p className="section-kicker">MOVIE DETAILS · LOCAL CATALOGUE</p>
          <h2>{movie.title}</h2>
          <p className="detail-meta">{movie.year || 'Year unknown'} <span>·</span> {movie.runtime || 'Runtime unknown'} <span>·</span> <RatingStars className="feature-rating" value={movie.rating} label={`${movie.title} TMDB rating`} /></p>
          <p className="detail-genre">{movie.genre || 'Genre not listed'}</p>
          <p className="detail-overview">{movie.overview || 'No synopsis is available in the local catalogue.'}</p>
          <p className="detail-people"><strong>Director</strong>{movie.director || 'Not listed'}</p>
          <p className="detail-people"><strong>Cast</strong>{movie.cast?.join(', ') || 'Not listed'}</p>
          <button className="feature-button detail-add" onClick={() => onAddMovie(movie)} disabled={Boolean(isInCollection)}>{isInCollection ? '✓ Already in your collection' : '＋ Add to my collection'}</button>
        </div>
      </div>
      <div className="tmdb-attribution"><span>Film information and poster artwork from <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>. This product is not endorsed or certified by TMDB.</span></div>
    </section>
  )
}
