import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { getTMDBMovieDetails, tmdbImage } from '../services/tmdb'
import type { TMDBMovieDetails } from '../services/tmdb'

type TMDBMovieDetailsPageProps = {
  onAddMovie: (movie: TMDBMovieDetails) => void
}

function explainDetailsError(error: unknown) {
  if (error instanceof Error && error.message === 'TMDB_KEY_MISSING') return 'TMDB needs an API key before it can load movie details.'
  if (error instanceof Error && error.message === 'TMDB_KEY_INVALID') return 'TMDB did not accept the API key. Check the configured key and try again.'
  return 'We could not load this movie from TMDB just now.'
}

export function TMDBMovieDetailsPage({ onAddMovie }: TMDBMovieDetailsPageProps) {
  const { tmdbId } = useParams<{ tmdbId: string }>()
  const movieId = Number(tmdbId)
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!Number.isInteger(movieId) || movieId <= 0) {
      setError('That movie link is not valid.')
      return
    }

    let cancelled = false
    setMovie(null)
    setError('')
    getTMDBMovieDetails(movieId)
      .then((details) => { if (!cancelled) setMovie(details) })
      .catch((requestError: unknown) => { if (!cancelled) setError(explainDetailsError(requestError)) })
    return () => { cancelled = true }
  }, [movieId])

  if (error) return <EmptyState role="alert" title="Could not load movie details" description={error} action={<Link className="retry-button" to="/discover">Back to Discover</Link>} />
  if (!movie) return <EmptyState role="status" icon="◌" title="Loading movie details…" />

  const posterUrl = tmdbImage(movie.poster_path)
  const director = movie.credits.crew.find((person) => person.job === 'Director')?.name

  return (
    <section className="movie-detail-route">
      <Link className="detail-back-link" to="/discover">← Back to Discover</Link>
      <div className="route-detail-card">
        {posterUrl ? <img className="tmdb-route-poster" src={posterUrl} alt={`${movie.title} poster`} /> : <div className="tmdb-route-poster missing-poster">No poster available</div>}
        <div className="route-detail-copy">
          <p className="section-kicker">MOVIE DETAILS · POWERED BY TMDB</p>
          <h2>{movie.title}</h2>
          <p className="detail-meta">{movie.release_date?.slice(0, 4) || 'Year unknown'} <span>·</span> {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Runtime unknown'} <span>·</span> <span className="feature-rating">★ {movie.vote_average.toFixed(1)}</span></p>
          <p className="detail-genre">{movie.genres.map((genre) => genre.name).join(' · ') || 'Genre not listed'}</p>
          <p className="detail-overview">{movie.overview || 'No synopsis is available for this movie yet.'}</p>
          <p className="detail-people"><strong>Director</strong>{director || 'Not listed'}</p>
          <p className="detail-people"><strong>Cast</strong>{movie.credits.cast.slice(0, 8).map((person) => person.name).join(', ') || 'Not listed'}</p>
          <button className="feature-button detail-add" onClick={() => onAddMovie(movie)}>＋ Add to my collection</button>
        </div>
      </div>
      <div className="tmdb-attribution"><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"><img src="https://www.themoviedb.org/assets/2/v4/logos/primary-green.svg" alt="TMDB" /></a><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></div>
    </section>
  )
}
