import type { ReactNode } from 'react'
import type { Movie } from '../types/movie'

type MoviePosterProps = {
  movie: Movie
  imageUrl?: string | null
  className?: string
  children?: ReactNode
  showFallbackTitle?: boolean
  decorative?: boolean
  variant?: 'poster' | 'feature'
}

export function MoviePoster({ movie, imageUrl = movie.posterUrl, className = '', children, showFallbackTitle = true, decorative = false, variant = 'poster' }: MoviePosterProps) {
  if (variant === 'feature') {
    if (!imageUrl) return null
    return <img key={movie.tmdbId ?? movie.id} className={`feature-poster ${className}`.trim()} src={imageUrl} alt={`${movie.title} poster`} />
  }

  const posterClasses = [
    'poster',
    `poster-${movie.poster}`,
    imageUrl ? 'poster-with-image' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={posterClasses}
      style={imageUrl ? { backgroundImage: `linear-gradient(0deg,#0d0b13 1%,transparent 65%),url("${imageUrl}")` } : undefined}
      role={decorative ? undefined : children ? 'group' : 'img'}
      aria-label={decorative ? undefined : children ? `Poster and actions for ${movie.title}` : movie.tone}
      aria-hidden={decorative || undefined}
    >
      {children ?? (!imageUrl && showFallbackTitle ? <span className="poster-title">{movie.title}</span> : null)}
    </div>
  )
}
