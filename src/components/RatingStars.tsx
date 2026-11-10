type RatingStarsProps = {
  value: number | string
  label: string
  onChange?: (rating: number) => void
  className?: string
}

export function RatingStars({ value, label, onChange, className }: RatingStarsProps) {
  if (!onChange) {
    return <span className={className} role="img" aria-label={label}>★ {value}</span>
  }

  const selectedRating = Number(value) || 0
  return (
    <div className={className ?? 'rating-stars'} role="group" aria-label={label}>
      {Array.from({ length: 10 }, (_, index) => {
        const starValue = index + 1
        return (
          <button
            key={starValue}
            type="button"
            className={starValue <= selectedRating ? 'rating-star selected' : 'rating-star'}
            onClick={() => onChange(starValue)}
            aria-label={`${starValue} out of 10 stars`}
            aria-pressed={selectedRating === starValue}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
