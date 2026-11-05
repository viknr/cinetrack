import { useState } from 'react'
import type { Movie } from '../types/movie'

type MovieRatingFlowProps = {
  movies: Movie[]
  onRate: (id: number, rating: number) => void
  onClose: () => void
}

export function MovieRatingFlow({ movies, onRate, onClose }: MovieRatingFlowProps) {
  const [movieIds] = useState(() => movies.map((movie) => movie.id))
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentMovie = movies.find((movie) => movie.id === movieIds[currentIndex])
  const [ratings, setRatings] = useState<Record<number, number>>(() => Object.fromEntries(
    movies.filter((movie) => typeof movie.userRating === 'number').map((movie) => [movie.id, movie.userRating as number]),
  ))
  const rating = currentMovie ? ratings[currentMovie.id] ?? currentMovie.userRating ?? 0 : 0

  function saveAndContinue() {
    if (!currentMovie || rating < 1) return
    onRate(currentMovie.id, rating)
    setCurrentIndex((index) => index + 1)
  }

  function skipMovie() {
    setCurrentIndex((index) => index + 1)
  }

  return (
    <div className="movie-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="movie-dialog rating-dialog" role="dialog" aria-modal="true" aria-labelledby="rating-dialog-title">
        <div className="movie-dialog-heading"><div><p className="section-kicker">YOUR PERSONAL SCORES</p><h2 id="rating-dialog-title">Rate your movies</h2></div><button className="dialog-close" type="button" onClick={onClose} aria-label="Close rating flow">×</button></div>
        {currentMovie ? <>
          <p className="rating-progress">Movie {currentIndex + 1} of {movieIds.length}</p>
          <div className="rating-movie-summary">
            {currentMovie.posterUrl && <img src={currentMovie.posterUrl} alt="" />}
            <div><h3>{currentMovie.title}</h3><p>{currentMovie.year} <span>·</span> {currentMovie.genre}</p></div>
          </div>
          <fieldset className="rating-picker">
            <legend>Choose a score out of 10</legend>
            <div className="rating-stars" role="group" aria-label={`Rating for ${currentMovie.title}`}>
              {Array.from({ length: 10 }, (_, index) => {
                const value = index + 1
                return <button key={value} type="button" className={value <= rating ? 'rating-star selected' : 'rating-star'} onClick={() => currentMovie && setRatings((current) => ({ ...current, [currentMovie.id]: value }))} aria-label={`${value} out of 10 stars`} aria-pressed={rating === value}>★</button>
              })}
            </div>
            <p className="rating-current">{rating ? `${rating} out of 10` : 'Select a rating'}</p>
          </fieldset>
          <div className="movie-form-actions rating-actions"><button type="button" className="form-cancel" onClick={skipMovie}>Skip for now</button><button className="add-movie" type="button" onClick={saveAndContinue} disabled={rating < 1}>{currentIndex === movieIds.length - 1 ? 'Save rating' : 'Save & next'}</button></div>
        </> : <div className="rating-complete"><span aria-hidden="true">✦</span><h3>You’re all caught up</h3><p>Your ratings are saved to your collection. You can update them any time.</p><button className="add-movie" type="button" onClick={onClose}>Done</button></div>}
      </section>
    </div>
  )
}
