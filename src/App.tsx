import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { DiscoverPage } from './components/DiscoverPage'
import { EmptyState } from './components/EmptyState'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Sidebar } from './components/Sidebar'
import { MovieForm, type MovieFormValues } from './components/MovieForm'
import { MovieRatingFlow } from './components/MovieRatingFlow'
import { CollectionPage } from './pages/CollectionPage'
import { DashboardPage } from './pages/DashboardPage'
import { MovieDetailsPage } from './pages/MovieDetailsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { clearDemoSession, readDemoSession, registerAccount, signInWithCredentials, type DemoSession } from './services/demoAuth'
import { fetchMovieCatalogue } from './services/movieData'
import { getCollectionStorageKey, useMovieStore } from './stores/movieStore'
import { tmdbImage } from './services/tmdb'
import type { TMDBMovieDetails } from './services/tmdb'
import type { Movie } from './types/movie'
import './App.css'

function AppRoutes() {
  const activeUserId = useMovieStore((state) => state.activeUserId)
  const movies = useMovieStore((state) => state.movies)
  const isLoadingCatalogue = useMovieStore((state) => state.isLoadingCatalogue)
  const catalogueError = useMovieStore((state) => state.catalogueError)
  const setMovies = useMovieStore((state) => state.setMovies)
  const setIsLoadingCatalogue = useMovieStore((state) => state.setIsLoadingCatalogue)
  const setCatalogueError = useMovieStore((state) => state.setCatalogueError)
  const toggleMovieWatched = useMovieStore((state) => state.toggleWatched)
  const addMovieToCollection = useMovieStore((state) => state.addMovie)
  const updateCollectionMovie = useMovieStore((state) => state.updateMovie)
  const saveMovieRating = useMovieStore((state) => state.rateMovie)
  const removeCollectionMovie = useMovieStore((state) => state.deleteMovie)
  const setActiveUser = useMovieStore((state) => state.setActiveUser)
  const [catalogueRetry, setCatalogueRetry] = useState(0)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false)
  const [isRatingFlowOpen, setIsRatingFlowOpen] = useState(false)
  const [session, setSession] = useState<DemoSession | null>(readDemoSession)
  const location = useLocation()
  const navigate = useNavigate()
  const signedInUserId = session?.userId ?? null

  async function signIn(email: string, password: string) {
    const nextSession = await signInWithCredentials(email, password)
    if (!nextSession) return false
    setIsLoadingCatalogue(true)
    setCatalogueError('')
    setActiveUser(nextSession.userId)
    setSession(nextSession)
    const returnPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
    navigate(returnPath, { replace: true })
    return true
  }

  async function signUp(displayName: string, email: string, password: string) {
    const result = await registerAccount(displayName, email, password)
    if (result.error || !result.session) return result.error ?? 'We could not create the account.'
    setIsLoadingCatalogue(true)
    setCatalogueError('')
    setActiveUser(result.session.userId)
    setSession(result.session)
    const returnPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
    navigate(returnPath, { replace: true })
    return null
  }

  function signOut() {
    clearDemoSession()
    setActiveUser(null)
    setSession(null)
    navigate('/', { replace: true })
  }

  const activePage = location.pathname === '/' ? 'Dashboard'
    : location.pathname === '/discover' ? 'Discover'
      : location.pathname === '/watchlist' ? 'My watchlist'
        : location.pathname === '/watched' ? 'Watched'
          : location.pathname.startsWith('/movies/') ? 'Movie details' : 'Page not found'

  const collectionMatchesSession = activeUserId === signedInUserId
  const currentMovies = useMemo(() => collectionMatchesSession ? movies : [], [collectionMatchesSession, movies])
  const isCurrentCollectionLoading = isLoadingCatalogue || (Boolean(signedInUserId) && !collectionMatchesSession)
  const watchedCount = currentMovies.filter((movie) => movie.status === 'watched').length
  const watchlistCount = currentMovies.filter((movie) => movie.status === 'watchlist').length
  const firstName = session?.displayName.trim().split(/\s+/)[0] || 'film fan'
  const ratedMovies = currentMovies.filter((movie) => typeof movie.userRating === 'number')
  const averageRating = ratedMovies.length
    ? (ratedMovies.reduce((total, movie) => total + (movie.userRating ?? 0), 0) / ratedMovies.length).toFixed(1)
    : null
  const visibleMovies = useMemo(() => {
    const query = search.trim().toLowerCase()
    return currentMovies.filter((movie) => !query || `${movie.title} ${movie.genre}`.toLowerCase().includes(query))
  }, [currentMovies, search])

  useEffect(() => {
    let cancelled = false
    if (!signedInUserId) {
      setActiveUser(null)
      setIsLoadingCatalogue(false)
      setCatalogueError('')
      return () => { cancelled = true }
    }

    setActiveUser(signedInUserId)
    setIsLoadingCatalogue(true)
    setCatalogueError('')
    fetchMovieCatalogue()
      .then((catalogue) => {
        if (cancelled) return
        const userCollectionKey = getCollectionStorageKey(signedInUserId)
        let savedMovies: Movie[] | null = null
        try {
          const userCollection = window.localStorage.getItem(userCollectionKey)
          if (userCollection) {
            const parsed: unknown = JSON.parse(userCollection)
            if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.id === 'number' && typeof item.title === 'string')) savedMovies = parsed as Movie[]
          }

          const legacyCollection = window.localStorage.getItem('cinetrack-movies')
          if (legacyCollection) {
            if (!savedMovies) {
              const parsed: unknown = JSON.parse(legacyCollection)
              if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.id === 'number' && typeof item.title === 'string')) {
                savedMovies = parsed as Movie[]
                window.localStorage.setItem(userCollectionKey, JSON.stringify(savedMovies))
              }
            }
            window.localStorage.removeItem('cinetrack-movies')
          }
        } catch {
          window.localStorage.removeItem(userCollectionKey)
        }
        setMovies(savedMovies ?? catalogue)
      })
      .catch((error: unknown) => {
        if (!cancelled) setCatalogueError(error instanceof Error ? error.message : 'We could not load the movie catalogue.')
      })
      .finally(() => { if (!cancelled) setIsLoadingCatalogue(false) })
    return () => { cancelled = true }
  }, [signedInUserId, catalogueRetry, setActiveUser, setCatalogueError, setIsLoadingCatalogue, setMovies])

  function toggleWatched(id: number) {
    toggleMovieWatched(id)
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
      updateCollectionMovie(existing.id, { status: 'watchlist' })
      showNotice(`${movie.title} moved to your watchlist`)
      return
    }
    const nextId = Math.max(0, ...movies.map((item) => item.id)) + 1
    addMovieToCollection({ ...movie, id: nextId, status: 'watchlist' })
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
    addMovieToCollection({
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
    })
    showNotice(`${movie.title} added to your watchlist`)
  }

  function saveMovie(values: MovieFormValues) {
    if (editingMovie) {
      updateCollectionMovie(editingMovie.id, values)
      showNotice(`${values.title} updated`)
    } else {
      const nextId = Math.max(0, ...movies.map((movie) => movie.id)) + 1
      addMovieToCollection({ ...values, id: nextId })
      showNotice(`${values.title} added to your watchlist`)
    }
    setIsMovieFormOpen(false)
    setEditingMovie(null)
  }

  function editMovie(movie: Movie) {
    setEditingMovie(movie)
    setIsMovieFormOpen(true)
  }

  function deleteMovie(movie: Movie) {
    if (!window.confirm(`Delete “${movie.title}” from your collection? This cannot be undone.`)) return
    removeCollectionMovie(movie.id)
    showNotice(`${movie.title} deleted`)
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

  if (location.pathname === '/signin') {
    return <SignInPage onSignIn={signIn} />
  }
  if (location.pathname === '/signup') {
    return <SignUpPage onSignUp={signUp} />
  }

  return (
    <div className="app-shell">
      <Sidebar watchlistCount={watchlistCount} isSignedIn={Boolean(session?.token)} displayName={session?.displayName ?? ''} onSignOut={signOut} />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>My space</span><span className="crumb-divider">/</span><strong>{activePage}</strong></div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activePage === 'Discover' ? 'Search TMDB...' : 'Search my movies...'} aria-label={activePage === 'Discover' ? 'Search TMDB movies' : 'Search my movies'} /><kbd>⌘ K</kbd></label>
          <button className="notification-button" aria-label="Notifications">♧<i /></button>
        </header>

        <div className="page-content">
          <section className="welcome-row"><div><p className="date-label">THURSDAY, NOVEMBER 5, 2026</p><h1>{activePage === 'Dashboard' ? <>Good evening, {firstName} <span>✦</span></> : activePage}</h1><p className="welcome-subtitle">{pageCopy[activePage]}</p></div>{!['Discover', 'Movie details', 'Page not found'].includes(activePage) && <button className="add-movie" disabled={isCurrentCollectionLoading} onClick={() => { setEditingMovie(null); setIsMovieFormOpen(true) }}><span>＋</span> Add a movie</button>}</section>

          <Routes>
            <Route path="/" element={<ProtectedRoute isAuthenticated={Boolean(session?.token)}>{isCurrentCollectionLoading ? <EmptyState role="status" icon="◌" title="Loading your collection…" /> : <DashboardPage movies={currentMovies} visibleMovies={visibleMovies} firstName={firstName} averageRating={averageRating} ratingCount={ratedMovies.length} watchlistCount={watchlistCount} watchedCount={watchedCount} isLoading={false} error={catalogueError} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} onAddMovie={addCarouselMovie} onRetry={retryCatalogue} onEdit={editMovie} onDelete={deleteMovie} onOpenRating={() => setIsRatingFlowOpen(true)} />}</ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute isAuthenticated={Boolean(session?.token)}>{isCurrentCollectionLoading ? <EmptyState role="status" icon="◌" title="Loading your collection…" /> : <DiscoverPage query={search} onQueryChange={setSearch} onAddMovie={addTMDBMovie} />}</ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute isAuthenticated={Boolean(session?.token)}><CollectionPage title="My watchlist" movies={visibleMovies.filter((movie) => movie.status === 'watchlist')} isLoading={isCurrentCollectionLoading} error={catalogueError} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} onRetry={retryCatalogue} onEdit={editMovie} onDelete={deleteMovie} /></ProtectedRoute>} />
            <Route path="/watched" element={<ProtectedRoute isAuthenticated={Boolean(session?.token)}><CollectionPage title="Watched" movies={visibleMovies.filter((movie) => movie.status === 'watched')} isLoading={isCurrentCollectionLoading} error={catalogueError} onToggleWatched={toggleWatched} onToggleSaved={toggleSaved} onRetry={retryCatalogue} onEdit={editMovie} onDelete={deleteMovie} /></ProtectedRoute>} />
            <Route path="/movies/:movieId" element={<ProtectedRoute isAuthenticated={Boolean(session?.token)}><MovieDetailsPage movies={currentMovies} isLoading={isCurrentCollectionLoading} error={catalogueError} onToggleWatched={toggleWatched} /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <footer className="page-footer"><span>Made for people who love movies <span className="footer-heart">♥</span></span><span>CINETRACK <span className="footer-dot">·</span> YOUR PERSONAL FILM SPACE</span></footer>
        </div>
      </main>
      {notice && <div className="toast" role="status">✓ &nbsp;{notice}</div>}
      {isMovieFormOpen && <MovieForm key={editingMovie?.id ?? 'new'} movie={editingMovie ?? undefined} onSave={saveMovie} onClose={() => { setIsMovieFormOpen(false); setEditingMovie(null) }} />}
      {isRatingFlowOpen && <MovieRatingFlow movies={currentMovies} onRate={saveMovieRating} onClose={() => setIsRatingFlowOpen(false)} />}
    </div>
  )
}

function App() {
  return <HashRouter><AppRoutes /></HashRouter>
}

export default App
