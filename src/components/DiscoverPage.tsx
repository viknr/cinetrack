import { Link } from 'react-router-dom'
import type { CatalogueSeries } from '../types/series'
import type { Movie } from '../types/movie'
import './DiscoverPage.css'

type DiscoverPageProps = {
  catalogue: Movie[]
  series: CatalogueSeries[]
  query: string
  onQueryChange: (query: string) => void
}

export function DiscoverPage({ catalogue, series, query, onQueryChange }: DiscoverPageProps) {
  const searchTerm = query.trim().toLocaleLowerCase()
  const movies = catalogue.filter((movie) => !searchTerm
    || `${movie.title} ${movie.year} ${movie.genre} ${movie.director ?? ''}`.toLocaleLowerCase().includes(searchTerm))
  const matchingSeries = series.filter((show) => !searchTerm
    || `${show.title} ${show.year} ${show.genres.join(' ')} ${show.cast.join(' ')}`.toLocaleLowerCase().includes(searchTerm))
  const resultCount = movies.length + matchingSeries.length

  return (
    <section className="discover-page" aria-label="Discover films and TV series">
      <div className="discover-intro"><div><p className="section-kicker">YOUR FILM &amp; TV CATALOGUE</p><h2>Find your next favourite</h2><p>Browse your chosen films and series, then open a title for the details.</p></div><span className="discover-symbol" aria-hidden="true">✦</span></div>

      <label className="discover-search"><span aria-hidden="true">⌕</span><input autoComplete="off" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search your catalogue…" aria-label="Search catalogue" /><kbd>{resultCount} {resultCount === 1 ? 'result' : 'results'}</kbd></label>

      {catalogue.length === 0 && series.length === 0
        ? <div className="discover-empty" role="alert"><span>⌕</span><h3>Could not load the catalogue</h3><p>Try refreshing the page. The catalogue is read from public/data.</p></div>
        : resultCount === 0
          ? <div className="discover-empty"><span>⌕</span><h3>No matching titles</h3><p>Try another film, series, year, genre or cast member.</p></div>
          : <>
            {movies.length > 0 && <section className="catalogue-section" aria-labelledby="catalogue-films-title">
              <div className="catalogue-section-heading"><h3 id="catalogue-films-title">Films</h3><span>{movies.length}</span></div>
              <div className="discover-results">{movies.map((movie) => {
                const poster = movie.posterUrl
                return <Link className="discover-result" key={movie.id} to={`/discover/movies/${movie.id}`} aria-label={`View details for ${movie.title}`}>
                  <span className="discover-poster" style={poster ? { backgroundImage: `linear-gradient(0deg,#11101655,transparent 48%),url("${poster}")` } : undefined}>{!poster && <span>No poster</span>}</span>
                  <span className="discover-result-copy"><strong>{movie.title}</strong><small>{movie.year || 'Year unknown'} <span>·</span> {movie.genre} <span>·</span> ★ {movie.rating}</small></span>
                </Link>
              })}</div>
            </section>}
            {matchingSeries.length > 0 && <section className="catalogue-section" aria-labelledby="catalogue-series-title">
              <div className="catalogue-section-heading"><h3 id="catalogue-series-title">TV series</h3><span>{matchingSeries.length}</span></div>
              <div className="discover-results">{matchingSeries.map((show) => <Link className="discover-result" key={show.id} to={`/discover/series/${show.id}`} aria-label={`View seasons and episodes for ${show.title}`}>
                <span className="discover-poster" style={show.posterUrl ? { backgroundImage: `linear-gradient(0deg,#11101655,transparent 48%),url("${show.posterUrl}")` } : undefined}>{!show.posterUrl && <span>No poster</span>}</span>
                <span className="discover-result-copy"><strong>{show.title}</strong><small>{show.year} <span>·</span> {show.seasons.length} seasons <span>·</span> {show.seasons.reduce((total, season) => total + season.episodes.length, 0)} episodes</small></span>
              </Link>)}</div>
            </section>}
          </>}

      <div className="catalogue-attributions"><p><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a> provides film information and posters. This product is not endorsed or certified by TMDB.</p><p>Series and episode information from <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer">TVmaze</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p></div>
    </section>
  )
}
