import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import './DiscoverPage.css'

type DiscoverPageProps = {
  catalogue: Movie[]
  query: string
  onQueryChange: (query: string) => void
}

export function DiscoverPage({ catalogue, query, onQueryChange }: DiscoverPageProps) {
  const searchTerm = query.trim().toLocaleLowerCase()
  const movies = catalogue.filter((movie) => !searchTerm
    || `${movie.title} ${movie.year} ${movie.genre} ${movie.director ?? ''}`.toLocaleLowerCase().includes(searchTerm))

  return (
    <section className="discover-page" aria-label="Discover movies">
      <div className="discover-intro"><div><p className="section-kicker">YOUR MOVIE CATALOGUE</p><h2>Find your next favourite</h2><p>Search the films in your catalogue, then add the ones you love to your collection.</p></div><span className="discover-symbol" aria-hidden="true">✦</span></div>

      <label className="discover-search"><span aria-hidden="true">⌕</span><input autoComplete="off" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search your catalogue…" aria-label="Search catalogue movies" /><kbd>{catalogue.length} films</kbd></label>

      {catalogue.length === 0
        ? <div className="discover-empty" role="alert"><span>⌕</span><h3>Could not load the movie catalogue</h3><p>Try refreshing the page. The catalogue is read from public/data/movies.json.</p></div>
        : movies.length === 0
          ? <div className="discover-empty"><span>⌕</span><h3>No matching movies</h3><p>Try another title, year, genre or director.</p></div>
          : <div className="discover-results">{movies.map((movie) => {
            const poster = movie.posterUrl
            return <Link className="discover-result" key={movie.id} to={`/discover/movies/${movie.id}`} aria-label={`View details for ${movie.title}`}>
              <span className="discover-poster" style={poster ? { backgroundImage: `linear-gradient(0deg,#11101655,transparent 48%),url("${poster}")` } : undefined}>{!poster && <span>No poster</span>}</span>
              <span className="discover-result-copy"><strong>{movie.title}</strong><small>{movie.year || 'Year unknown'} <span>·</span> {movie.genre} <span>·</span> ★ {movie.rating}</small></span>
            </Link>
          })}</div>}

      <div className="tmdb-attribution"><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"><img src="https://www.themoviedb.org/assets/2/v4/logos/primary-green.svg" alt="TMDB" /></a><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></div>
    </section>
  )
}
