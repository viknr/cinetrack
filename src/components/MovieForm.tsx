import { useEffect, useState, type FormEvent } from 'react'
import type { Movie } from '../types/movie'

export type MovieFormValues = Omit<Movie, 'id'>

type MovieFormProps = {
  movie?: Movie
  onSave: (values: MovieFormValues) => void
  onClose: () => void
}

const currentYear = new Date().getFullYear()

export function MovieForm({ movie, onSave, onClose }: MovieFormProps) {
  const [title, setTitle] = useState(movie?.title ?? '')
  const [year, setYear] = useState(String(movie?.year || ''))
  const [genre, setGenre] = useState(movie?.genre ?? '')
  const [rating, setRating] = useState(movie?.rating ?? '')
  const [runtime, setRuntime] = useState(movie?.runtime ?? '')
  const [posterUrl, setPosterUrl] = useState(movie?.posterUrl ?? '')
  const [overview, setOverview] = useState(movie?.overview ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const parsedYear = Number(year)
    const parsedRating = Number(rating)
    if (!title.trim()) nextErrors.title = 'Enter a movie title.'
    if (!Number.isInteger(parsedYear) || parsedYear < 1888 || parsedYear > currentYear + 5) nextErrors.year = `Enter a year from 1888 to ${currentYear + 5}.`
    if (!genre.trim()) nextErrors.genre = 'Enter at least one genre.'
    if (rating === '' || !Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 10) nextErrors.rating = 'Rating must be between 0 and 10.'
    if (posterUrl.trim() && !/^https?:\/\//i.test(posterUrl.trim())) nextErrors.posterUrl = 'Poster link must start with http:// or https://.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const normalizedTitle = title.trim()
    onSave({
      ...(movie ?? {} as Movie),
      title: normalizedTitle,
      year: parsedYear,
      genre: genre.trim(),
      rating: parsedRating.toFixed(1),
      runtime: runtime.trim() || 'Runtime unknown',
      poster: movie?.poster ?? 'custom',
      tone: movie?.tone ?? `Poster for ${normalizedTitle}`,
      posterUrl: posterUrl.trim() || undefined,
      overview: overview.trim() || undefined,
      status: movie?.status ?? 'watchlist',
    })
  }

  return (
    <div className="movie-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="movie-dialog" role="dialog" aria-modal="true" aria-labelledby="movie-form-title">
        <div className="movie-dialog-heading"><div><p className="section-kicker">YOUR COLLECTION</p><h2 id="movie-form-title">{movie ? 'Edit movie' : 'Add a movie'}</h2></div><button className="dialog-close" type="button" onClick={onClose} aria-label="Close form">×</button></div>
        <form onSubmit={submit} noValidate>
          <div className="movie-form-grid">
            <label>Title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'movie-title-error' : undefined} />{errors.title && <small id="movie-title-error" className="field-error">{errors.title}</small>}</label>
            <label>Release year<input type="number" min="1888" max={currentYear + 5} value={year} onChange={(event) => setYear(event.target.value)} aria-invalid={Boolean(errors.year)} aria-describedby={errors.year ? 'movie-year-error' : undefined} />{errors.year && <small id="movie-year-error" className="field-error">{errors.year}</small>}</label>
            <label>Genre<input value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="e.g. Drama, Sci-fi" aria-invalid={Boolean(errors.genre)} aria-describedby={errors.genre ? 'movie-genre-error' : undefined} />{errors.genre && <small id="movie-genre-error" className="field-error">{errors.genre}</small>}</label>
            <label>Rating (0–10)<input type="number" min="0" max="10" step="0.1" value={rating} onChange={(event) => setRating(event.target.value)} aria-invalid={Boolean(errors.rating)} aria-describedby={errors.rating ? 'movie-rating-error' : undefined} />{errors.rating && <small id="movie-rating-error" className="field-error">{errors.rating}</small>}</label>
            <label>Runtime<input value={runtime} onChange={(event) => setRuntime(event.target.value)} placeholder="e.g. 2h 15m" /></label>
            <label>Poster image URL<input type="url" value={posterUrl} onChange={(event) => setPosterUrl(event.target.value)} placeholder="https://…" aria-invalid={Boolean(errors.posterUrl)} aria-describedby={errors.posterUrl ? 'movie-poster-error' : undefined} />{errors.posterUrl && <small id="movie-poster-error" className="field-error">{errors.posterUrl}</small>}</label>
            <label className="movie-form-wide">Synopsis<textarea rows={3} value={overview} onChange={(event) => setOverview(event.target.value)} /></label>
          </div>
          <div className="movie-form-actions"><button type="button" className="form-cancel" onClick={onClose}>Cancel</button><button className="add-movie" type="submit">{movie ? 'Save changes' : 'Add movie'}</button></div>
        </form>
      </section>
    </div>
  )
}
