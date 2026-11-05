import { useEffect, useState } from 'react'
import { getTMDBMovieDetails, searchTMDBMovies, tmdbImage } from '../services/tmdb'
import type { TMDBMovieDetails, TMDBMovieResult } from '../services/tmdb'
import './DiscoverPage.css'

type DiscoverPageProps = {
  query: string
  onQueryChange: (query: string) => void
  onAddMovie: (movie: TMDBMovieDetails) => void
}

function explainError(error: unknown) {
  if (error instanceof Error && error.message === 'TMDB_KEY_MISSING') {
    return 'Connect your TMDB API key to start searching. Add VITE_TMDB_API_KEY=your_key to a .env.local file in the project folder, then restart Vite.'
  }
  if (error instanceof Error && error.message === 'TMDB_KEY_INVALID') {
    return 'TMDB did not accept that API key. Check the value in .env.local, then restart Vite.'
  }
  return 'We couldn’t reach TMDB just now. Check your internet connection and try again.'
}

function releaseYear(date: string) {
  return date ? date.slice(0, 4) : 'Year unknown'
}

export function DiscoverPage({ query, onQueryChange, onAddMovie }: DiscoverPageProps) {
  const [results, setResults] = useState<TMDBMovieResult[]>([])
  const [resultsQuery, setResultsQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchingQuery, setSearchingQuery] = useState('')
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [error, setError] = useState('')
  const [errorQuery, setErrorQuery] = useState('')

  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) return

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setSearching(true)
      setSearchingQuery(term)
      setError('')
      setResults([])
      setResultsQuery('')
      setSelectedId(null)
      setDetails(null)
      setDetailsError('')
      try {
        const movies = await searchTMDBMovies(term)
        if (!cancelled) {
          setResults(movies.slice(0, 8))
          setResultsQuery(term)
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(explainError(requestError))
          setErrorQuery(term)
        }
      } finally {
        if (!cancelled) setSearching(false)
      }
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    if (selectedId === null) return
    let cancelled = false
    getTMDBMovieDetails(selectedId)
      .then((movie) => { if (!cancelled) setDetails(movie) })
      .catch((requestError: unknown) => { if (!cancelled) setDetailsError(explainError(requestError)) })
      .finally(() => { if (!cancelled) setLoadingDetails(false) })
    return () => { cancelled = true }
  }, [selectedId])

  const currentResults = resultsQuery === query.trim() ? results : []
  const currentError = errorQuery === query.trim() ? error : ''
  const currentSearching = searching && searchingQuery === query.trim()
  const hasSelectedResult = currentResults.some((movie) => movie.id === selectedId)
  const currentDetails = hasSelectedResult ? details : null
  const currentDetailsError = hasSelectedResult ? detailsError : ''

  return (
    <section className="discover-page" aria-label="Discover movies">
      <div className="discover-intro"><div><p className="section-kicker">POWERED BY TMDB</p><h2>Find your next favourite</h2><p>Search millions of films, then add the ones you love to your collection.</p></div><span className="discover-symbol" aria-hidden="true">✦</span></div>

      <label className="discover-search"><span aria-hidden="true">⌕</span><input autoComplete="off" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Try a title like Dune or Spirited Away" aria-label="Search TMDB movies" /><kbd>⌕</kbd></label>

      {currentError && <p className="api-message" role="alert">{currentError}</p>}
      {currentSearching && <p className="api-loading" role="status">Searching movies…</p>}
      {!query.trim() && !currentError && <div className="discover-empty"><span>⌕</span><h3>Start with a movie title</h3><p>Search to see real posters, release years and ratings from TMDB.</p></div>}
      {query.trim().length === 1 && <div className="discover-empty compact"><h3>Type one more letter to search</h3></div>}
      {!currentSearching && query.trim().length >= 2 && !currentError && resultsQuery === query.trim() && currentResults.length === 0 && <div className="discover-empty"><span>⌕</span><h3>No matching movies</h3><p>Try another title or check the spelling.</p></div>}

      {currentResults.length > 0 && <div className="discover-results">{currentResults.map((movie) => {
        const poster = tmdbImage(movie.poster_path, 'w342')
        return <button className={`discover-result ${selectedId === movie.id ? 'selected' : ''}`} key={movie.id} onClick={() => { setSelectedId(movie.id); setLoadingDetails(true); setDetails(null); setError(''); setDetailsError('') }}>
          <span className="discover-poster" style={poster ? { backgroundImage: `linear-gradient(0deg,#11101655,transparent 48%),url("${poster}")` } : undefined}>{!poster && <span>No poster</span>}</span>
          <span className="discover-result-copy"><strong>{movie.title}</strong><small>{releaseYear(movie.release_date)} <span>·</span> ★ {movie.vote_average.toFixed(1)}</small></span>
        </button>
      })}</div>}

      {hasSelectedResult && (loadingDetails || currentDetails || currentDetailsError) && <section className="movie-detail-panel" aria-live="polite">
        {loadingDetails && <p className="api-loading">Loading movie details…</p>}
        {currentDetailsError && <p className="api-message" role="alert">{currentDetailsError}</p>}
        {currentDetails && <>
          <div className="detail-backdrop" style={tmdbImage(currentDetails.backdrop_path, 'w1280') ? { backgroundImage: `linear-gradient(90deg,#15131ddf,#15131d48),url("${tmdbImage(currentDetails.backdrop_path, 'w1280')}")` } : undefined} />
          <div className="detail-content"><div className="detail-poster-wrap">{tmdbImage(currentDetails.poster_path) ? <img className="detail-poster" src={tmdbImage(currentDetails.poster_path) ?? undefined} alt={`${currentDetails.title} poster`} /> : <div className="detail-poster missing-poster">No poster available</div>}</div>
            <div className="detail-copy"><p className="section-kicker">MOVIE DETAILS</p><h3>{currentDetails.title}</h3><p className="detail-meta">{releaseYear(currentDetails.release_date)} <span>·</span> {currentDetails.runtime ? `${Math.floor(currentDetails.runtime / 60)}h ${currentDetails.runtime % 60}m` : 'Runtime unknown'} <span>·</span> <span className="feature-rating">★ {currentDetails.vote_average.toFixed(1)}</span></p>
              <div className="detail-genres">{currentDetails.genres.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
              <p className="detail-overview">{currentDetails.overview || 'No synopsis is available for this movie yet.'}</p>
              <p className="detail-people"><strong>Director</strong>{currentDetails.credits.crew.find((person) => person.job === 'Director')?.name ?? 'Not listed'}</p>
              <p className="detail-people"><strong>Cast</strong>{currentDetails.credits.cast.slice(0, 5).map((person) => person.name).join(', ') || 'Not listed'}</p>
              <button className="feature-button detail-add" onClick={() => onAddMovie(currentDetails)}>＋ Add to my collection</button>
            </div>
          </div>
        </>}
      </section>}

      <div className="tmdb-attribution"><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"><img src="https://www.themoviedb.org/assets/2/v4/logos/primary-green.svg" alt="TMDB" /></a><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></div>
    </section>
  )
}
