import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findTMDBMovieDetails, getTMDBMovieDetails, tmdbImage } from '../services/tmdb'
import type { TMDBMovieDetails } from '../services/tmdb'
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
  const lookupMovieId = movie?.id
  const lookupMovieTitle = movie?.title ?? ''
  const lookupMovieYear = movie?.year ?? 0
  const lookupTMDBId = movie?.tmdbId
  const hasStoredOverview = Boolean(movie?.overview)
  const [fetchedDetails, setFetchedDetails] = useState<{ catalogueId: number; details: TMDBMovieDetails } | null>(null)
  const [lookupError, setLookupError] = useState<{ catalogueId: number; message: string } | null>(null)

  useEffect(() => {
    if (lookupMovieId === undefined || hasStoredOverview) return
    let cancelled = false
    const request = lookupTMDBId ? getTMDBMovieDetails(lookupTMDBId) : findTMDBMovieDetails(lookupMovieTitle, lookupMovieYear)
    request
      .then((details) => { if (!cancelled) setFetchedDetails({ catalogueId: lookupMovieId, details }) })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          const message = requestError instanceof Error && requestError.message === 'TMDB_KEY_MISSING'
            ? 'TMDB details need an API key in .env.local.'
            : requestError instanceof Error && requestError.message === 'TMDB_KEY_INVALID'
              ? 'TMDB did not accept the API key. Check .env.local.'
              : requestError instanceof Error && requestError.message === 'TMDB_MOVIE_NOT_FOUND'
                ? 'TMDB could not find a match for this title.'
                : 'We could not load extra details from TMDB just now.'
          setLookupError({ catalogueId: lookupMovieId, message })
        }
      })
    return () => { cancelled = true }
  }, [lookupMovieId, lookupMovieTitle, lookupMovieYear, lookupTMDBId, hasStoredOverview])

  const tmdbDetails = fetchedDetails && fetchedDetails.catalogueId === movie?.id ? fetchedDetails.details : null
  const tmdbError = lookupError && lookupError.catalogueId === movie?.id ? lookupError.message : ''
  const isLookingUpTMDB = Boolean(movie && !movie.overview && !tmdbDetails && !tmdbError)

  if (isLoading) return <div className="empty-state" role="status"><span>◌</span><h3>Loading movie details…</h3></div>
  if (error) return <div className="empty-state" role="alert"><h3>Could not load your movies</h3><p>{error}</p><Link className="retry-button" to="/">Return to dashboard</Link></div>
  if (!movie) return <div className="empty-state"><span>⌕</span><h3>We couldn’t find that movie</h3><p>It may have been removed from your collection.</p><Link className="retry-button" to="/watchlist">Back to watchlist</Link></div>

  return (
    <section className="movie-detail-route">
      <Link className="detail-back-link" to={movie.status === 'watched' ? '/watched' : '/watchlist'}>← Back to {movie.status === 'watched' ? 'watched movies' : 'watchlist'}</Link>
      <div className="route-detail-card">
        <div className={`poster poster-${movie.poster} route-detail-poster ${movie.posterUrl || tmdbDetails?.poster_path ? 'poster-with-image' : ''}`} style={movie.posterUrl || tmdbImage(tmdbDetails?.poster_path ?? null) ? { backgroundImage: `linear-gradient(0deg,#0d0b13 1%,transparent 65%),url("${movie.posterUrl ?? tmdbImage(tmdbDetails?.poster_path ?? null)}")` } : undefined} role="img" aria-label={movie.tone}>
          {!movie.posterUrl && !tmdbDetails?.poster_path && <span className="poster-title">{movie.title}</span>}
        </div>
        <div className="route-detail-copy"><p className="section-kicker">MOVIE DETAILS</p><h2>{tmdbDetails?.title ?? movie.title}</h2><p className="detail-meta">{tmdbDetails?.release_date?.slice(0, 4) || movie.year || 'Year unknown'} <span>·</span> {tmdbDetails?.runtime ? `${Math.floor(tmdbDetails.runtime / 60)}h ${tmdbDetails.runtime % 60}m` : movie.runtime} <span>·</span> <span className="feature-rating">★ {tmdbDetails?.vote_average.toFixed(1) ?? movie.rating}</span></p><p className="detail-genre">{tmdbDetails?.genres.map((genre) => genre.name).join(' · ') || movie.genre}</p>
          <p className="detail-overview">{tmdbDetails?.overview || movie.overview || (isLookingUpTMDB ? 'Loading full details from TMDB…' : tmdbError || 'No synopsis is available for this movie yet.')}</p>
          <p className="detail-people"><strong>Director</strong>{tmdbDetails?.credits.crew.find((person) => person.job === 'Director')?.name || movie.director || (isLookingUpTMDB ? 'Loading…' : tmdbError ? 'Unavailable' : 'Not listed')}</p>
          <p className="detail-people"><strong>Cast</strong>{tmdbDetails?.credits.cast.slice(0, 5).map((person) => person.name).join(', ') || movie.cast?.join(', ') || (isLookingUpTMDB ? 'Loading…' : tmdbError ? 'Unavailable' : 'Not listed')}</p>
          <button className="feature-button detail-add" onClick={() => onToggleWatched(movie.id)}>{movie.status === 'watched' ? '↩ Move to watchlist' : '✓ Mark as watched'}</button>
        </div>
      </div>
    </section>
  )
}
