import { useMemo, useState } from 'react'
import { MovieCard } from './components/MovieCard'
import { DiscoverPage } from './components/DiscoverPage'
import { Sidebar } from './components/Sidebar'
import { featuredMovie, movies as initialMovies } from './data/movies'
import { tmdbImage } from './services/tmdb'
import type { TMDBMovieDetails } from './services/tmdb'
import type { Movie } from './types/movie'
import './App.css'

function App() {
  const [movies, setMovies] = useState(initialMovies)
  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')

  const watchedCount = movies.filter((movie) => movie.status === 'watched').length
  const watchlistCount = movies.filter((movie) => movie.status === 'watchlist').length
  const visibleMovies = useMemo(() => {
    const query = search.trim().toLowerCase()
    return movies.filter((movie) => {
      const matchesSearch = !query || `${movie.title} ${movie.genre}`.toLowerCase().includes(query)
      const matchesPage = activePage === 'My watchlist' ? movie.status === 'watchlist'
        : activePage === 'Watched' ? movie.status === 'watched' : true
      return matchesSearch && matchesPage
    })
  }, [activePage, movies, search])

  function toggleWatched(id: number) {
    setMovies((current) => current.map((movie) => movie.id === id ? { ...movie, status: movie.status === 'watched' ? 'watchlist' : 'watched' } : movie))
  }

  function toggleSaved(id: number) {
    const movie = movies.find((item) => item.id === id)
    if (!movie) return
    toggleWatched(id)
    setNotice(movie.status === 'watchlist' ? `${movie.title} marked as watched` : `${movie.title} moved to your watchlist`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function navigate(page: string) {
    setActivePage(page)
    if (page === 'Discover') setSearch('')
  }

  function addFeaturedMovie() {
    const alreadyAdded = movies.some((movie) => movie.title === featuredMovie.title)
    if (alreadyAdded) {
      setNotice(`${featuredMovie.title} is already in your collection`)
    } else {
      setMovies((current) => [...current, { id: 100, title: featuredMovie.title, year: 2014, genre: 'Sci-fi', rating: '8.7', runtime: featuredMovie.runtime, poster: 'interstellar', tone: 'A glowing planet beneath a dark space sky', status: 'watchlist' }])
      setNotice(`${featuredMovie.title} added to your watchlist`)
    }
    window.setTimeout(() => setNotice(''), 2600)
  }

  function addTMDBMovie(movie: TMDBMovieDetails) {
    if (movies.some((item) => item.tmdbId === movie.id)) {
      setNotice(`${movie.title} is already in your collection`)
      window.setTimeout(() => setNotice(''), 2600)
      return
    }

    const year = Number(movie.release_date?.slice(0, 4)) || 0
    const posterUrl = tmdbImage(movie.poster_path)
    const nextId = Math.max(0, ...movies.map((item) => item.id)) + 1
    setMovies((current) => [...current, {
      id: nextId,
      tmdbId: movie.id,
      title: movie.title,
      year,
      genre: movie.genres.slice(0, 2).map((genre) => genre.name).join(' / ') || 'Movie',
      rating: movie.vote_average.toFixed(1),
      runtime: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Runtime unknown',
      poster: 'tmdb',
      posterUrl: posterUrl ?? undefined,
      overview: movie.overview,
      director: movie.credits.crew.find((person) => person.job === 'Director')?.name,
      cast: movie.credits.cast.slice(0, 5).map((person) => person.name),
      tone: `Movie poster for ${movie.title}`,
      status: 'watchlist',
    }])
    setNotice(`${movie.title} added to your watchlist`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} watchlistCount={watchlistCount} onNavigate={navigate} />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>My space</span><span className="crumb-divider">/</span><strong>{activePage}</strong></div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activePage === 'Discover' ? 'Search TMDB...' : 'Search my movies...'} aria-label={activePage === 'Discover' ? 'Search TMDB movies' : 'Search my movies'} /><kbd>⌘ K</kbd></label>
          <button className="notification-button" aria-label="Notifications">♧<i /></button>
        </header>

        <div className="page-content">
          <section className="welcome-row"><div><p className="date-label">THURSDAY, NOVEMBER 5, 2026</p><h1>{activePage === 'Dashboard' ? <>Good evening, Alex <span>✦</span></> : activePage}</h1><p className="welcome-subtitle">{activePage === 'Dashboard' ? 'A little movie time goes a long way.' : activePage === 'Discover' ? 'Find something wonderful to watch.' : activePage === 'Watched' ? 'Your personal collection of cinema memories.' : 'All the films you can’t wait to watch.'}</p></div><button className="add-movie" onClick={() => { setActivePage('Discover'); setNotice('Movie search is ready — find a film to add to your collection.') }}><span>＋</span> Add a movie</button></section>

          {activePage === 'Dashboard' && <>
            <section className="feature-banner" aria-label={`Featured movie: ${featuredMovie.title}`}>
              <div className="feature-art" aria-hidden="true"><div className="planet" /><div className="horizon" /><span className="astronaut">◌</span></div>
              <div className="feature-content"><p className="feature-eyebrow"><span>✦</span> {featuredMovie.eyebrow}</p><h2>{featuredMovie.title}</h2><p className="feature-description">{featuredMovie.description}</p><div className="feature-meta"><span>{featuredMovie.year}</span><span>{featuredMovie.genre}</span><span>{featuredMovie.runtime}</span><span className="feature-rating">★ {featuredMovie.rating}</span></div><button className="feature-button" onClick={addFeaturedMovie}>＋ Add to watchlist</button></div>
              <span className="feature-side-label">CINEPICK&nbsp; / &nbsp;01</span>
            </section>

            <section className="stats-grid" aria-label="Your movie stats">
              <article className="stat-card"><div className="stat-icon violet">▤</div><div><p>IN YOUR WATCHLIST</p><strong>{watchlistCount}</strong><span>films to look forward to</span></div><span className="stat-arrow">↗</span></article>
              <article className="stat-card"><div className="stat-icon green">✓</div><div><p>MOVIES WATCHED</p><strong>{watchedCount}</strong><span>you’re on a roll!</span></div><span className="stat-arrow">↗</span></article>
              <article className="stat-card"><div className="stat-icon amber">★</div><div><p>YOUR AVERAGE RATING</p><strong>8.2<span className="stat-unit">/10</span></strong><span>excellent taste, Alex</span></div><span className="stat-arrow">↗</span></article>
            </section>
          </>}

          {activePage === 'Discover' ? <DiscoverPage query={search} onQueryChange={setSearch} onAddMovie={addTMDBMovie} /> : <section className="collection-section">
            <div className="section-heading"><div><p className="section-kicker">YOUR COLLECTION</p><h2>{activePage === 'Dashboard' || activePage === 'Discover' ? 'Picked for you' : activePage}</h2></div><div className="section-actions"><span className="movie-count">{visibleMovies.length} films</span><button className="view-all" onClick={() => navigate(activePage === 'Dashboard' ? 'Discover' : 'Dashboard')}>{activePage === 'Dashboard' ? 'View all' : 'Back to dashboard'} <span>↗</span></button></div></div>
            {visibleMovies.length > 0 ? <div className="movie-grid">{visibleMovies.map((movie: Movie) => <MovieCard key={movie.id} movie={movie} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} />)}</div> : <div className="empty-state"><span>⌕</span><h3>No films found</h3><p>Try a different title or genre.</p></div>}
          </section>}
          <footer className="page-footer"><span>Made for people who love movies <span className="footer-heart">♥</span></span><span>CINETRACK <span className="footer-dot">·</span> YOUR PERSONAL FILM SPACE</span></footer>
        </div>
      </main>
      {notice && <div className="toast" role="status">✓ &nbsp;{notice}</div>}
    </div>
  )
}

export default App
