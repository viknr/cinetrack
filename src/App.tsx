import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { DiscoverPage } from './components/DiscoverPage'
import { Sidebar } from './components/Sidebar'
import { CollectionPage } from './pages/CollectionPage'
import { DashboardPage } from './pages/DashboardPage'
import { MovieDetailsPage } from './pages/MovieDetailsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { fetchMovieCatalogue } from './services/movieData'
import { tmdbImage } from './services/tmdb'
import type { TMDBMovieDetails } from './services/tmdb'
import type { Movie } from './types/movie'
import './App.css'

const pagePaths: Record<string, string> = {
  Dashboard: '/',
  Discover: '/discover',
  'My watchlist': '/watchlist',
  Watched: '/watched',
}

function AppRoutes() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoadingCatalogue, setIsLoadingCatalogue] = useState(true)
  const [catalogueError, setCatalogueError] = useState('')
  const [catalogueRetry, setCatalogueRetry] = useState(0)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const activePage = location.pathname === '/' ? 'Dashboard'
    : location.pathname === '/discover' ? 'Discover'
      : location.pathname === '/watchlist' ? 'My watchlist'
        : location.pathname === '/watched' ? 'Watched'
          : location.pathname.startsWith('/movies/') ? 'Movie details' : 'Page not found'

  const watchedCount = movies.filter((movie) => movie.status === 'watched').length
  const watchlistCount = movies.filter((movie) => movie.status === 'watchlist').length
  const visibleMovies = useMemo(() => {
    const query = search.trim().toLowerCase()
    return movies.filter((movie) => !query || `${movie.title} ${movie.genre}`.toLowerCase().includes(query))
  }, [movies, search])

  useEffect(() => {
    let cancelled = false
    fetchMovieCatalogue()
      .then((catalogue) => { if (!cancelled) setMovies(catalogue) })
      .catch((error: unknown) => {
        if (!cancelled) setCatalogueError(error instanceof Error ? error.message : 'We could not load the movie catalogue.')
      })
      .finally(() => { if (!cancelled) setIsLoadingCatalogue(false) })
    return () => { cancelled = true }
  }, [catalogueRetry])

  function navigateToPage(page: string) {
    if (page === 'Discover') setSearch('')
    navigate(pagePaths[page] ?? '/')
  }

  function toggleWatched(id: number) {
    setMovies((current) => current.map((movie) => movie.id === id ? { ...movie, status: movie.status === 'watched' ? 'watchlist' : 'watched' } : movie))
  }

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function toggleSaved(id: number) {
    const movie = movies.find((item) => item.id === id)
    if (!movie) return
    toggleWatched(id)
    showNotice(movie.status === 'watchlist' ? `${movie.title} marked as watched` : `${movie.title} moved to your watchlist`)
  }

  function addCarouselMovie(movie: Movie) {
    const existing = movies.find((item) => item.tmdbId && movie.tmdbId ? item.tmdbId === movie.tmdbId : item.title === movie.title)
    if (existing?.status === 'watchlist') {
      showNotice(`${movie.title} is already in your watchlist`)
      return
    }
    if (existing) {
      setMovies((current) => current.map((item) => item.id === existing.id ? { ...item, status: 'watchlist' } : item))
      showNotice(`${movie.title} moved to your watchlist`)
      return
    }
    const nextId = Math.max(0, ...movies.map((item) => item.id)) + 1
    setMovies((current) => [...current, { ...movie, id: nextId, status: 'watchlist' }])
    showNotice(`${movie.title} added to your watchlist`)
  }

  function addTMDBMovie(movie: TMDBMovieDetails) {
    if (movies.some((item) => item.tmdbId === movie.id)) {
      showNotice(`${movie.title} is already in your collection`)
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
    showNotice(`${movie.title} added to your watchlist`)
  }

  function retryCatalogue() {
    setIsLoadingCatalogue(true)
    setCatalogueError('')
    setCatalogueRetry((attempt) => attempt + 1)
  }

  const pageCopy: Record<string, string> = {
    Dashboard: 'A little movie time goes a long way.',
    Discover: 'Find something wonderful to watch.',
    'My watchlist': 'All the films you can’t wait to watch.',
    Watched: 'Your personal collection of cinema memories.',
    'Movie details': 'A closer look at this film.',
    'Page not found': 'Let’s get you back to the movies.',
  }

  return (
    <div className="app-shell">
      <Sidebar watchlistCount={watchlistCount} />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>My space</span><span className="crumb-divider">/</span><strong>{activePage}</strong></div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activePage === 'Discover' ? 'Search TMDB...' : 'Search my movies...'} aria-label={activePage === 'Discover' ? 'Search TMDB movies' : 'Search my movies'} /><kbd>⌘ K</kbd></label>
          <button className="notification-button" aria-label="Notifications">♧<i /></button>
        </header>

        <div className="page-content">
          <section className="welcome-row"><div><p className="date-label">THURSDAY, NOVEMBER 5, 2026</p><h1>{activePage === 'Dashboard' ? <>Good evening, Alex <span>✦</span></> : activePage}</h1><p className="welcome-subtitle">{pageCopy[activePage]}</p></div>{!['Discover', 'Movie details', 'Page not found'].includes(activePage) && <button className="add-movie" onClick={() => navigateToPage('Discover')}><span>＋</span> Add a movie</button>}</section>

          <Routes>
            <Route path="/" element={<DashboardPage movies={movies} visibleMovies={visibleMovies} watchlistCount={watchlistCount} watchedCount={watchedCount} isLoading={isLoadingCatalogue} error={catalogueError} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} onAddMovie={addCarouselMovie} onRetry={retryCatalogue} />} />
            <Route path="/discover" element={<DiscoverPage query={search} onQueryChange={setSearch} onAddMovie={addTMDBMovie} />} />
            <Route path="/watchlist" element={<CollectionPage title="My watchlist" movies={visibleMovies.filter((movie) => movie.status === 'watchlist')} isLoading={isLoadingCatalogue} error={catalogueError} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} onRetry={retryCatalogue} />} />
            <Route path="/watched" element={<CollectionPage title="Watched" movies={visibleMovies.filter((movie) => movie.status === 'watched')} isLoading={isLoadingCatalogue} error={catalogueError} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} onRetry={retryCatalogue} />} />
            <Route path="/movies/:movieId" element={<MovieDetailsPage movies={movies} isLoading={isLoadingCatalogue} error={catalogueError} onToggleWatched={toggleWatched} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <footer className="page-footer"><span>Made for people who love movies <span className="footer-heart">♥</span></span><span>CINETRACK <span className="footer-dot">·</span> YOUR PERSONAL FILM SPACE</span></footer>
        </div>
      </main>
      {notice && <div className="toast" role="status">✓ &nbsp;{notice}</div>}
    </div>
  )
}

function App() {
  return <HashRouter><AppRoutes /></HashRouter>
}

export default App
