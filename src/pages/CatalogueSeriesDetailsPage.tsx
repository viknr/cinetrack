import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import type { CatalogueSeries } from '../types/series'

type CatalogueSeriesDetailsPageProps = {
  catalogue: CatalogueSeries[]
  isLoading: boolean
  error: string
}

function formatAirDate(date: string | null) {
  if (!date) return 'Air date unavailable'
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

export function CatalogueSeriesDetailsPage({ catalogue, isLoading, error }: CatalogueSeriesDetailsPageProps) {
  const { seriesId } = useParams<{ seriesId: string }>()
  const series = catalogue.find((item) => item.id === Number(seriesId))

  if (isLoading) return <EmptyState role="status" icon="◌" title="Loading series details…" />
  if (error) return <EmptyState role="alert" title="Could not load series details" description={error} action={<Link className="retry-button" to="/discover">Back to Discover</Link>} />
  if (!series) return <EmptyState icon="⌕" title="We couldn’t find that series" description="It may have been removed from the local catalogue." action={<Link className="retry-button" to="/discover">Back to Discover</Link>} />

  const episodeCount = series.seasons.reduce((total, season) => total + season.episodes.length, 0)

  return (
    <section className="series-detail-route">
      <Link className="detail-back-link" to="/discover">← Back to Discover</Link>
      <div className="route-detail-card series-detail-card">
        {series.posterUrl
          ? <img className="route-detail-poster series-route-poster" src={series.posterUrl} alt={`${series.title} poster`} />
          : <div className="route-detail-poster series-poster-fallback" role="img" aria-label={`No poster for ${series.title}`}>{series.title}</div>}
        <div className="route-detail-copy">
          <p className="section-kicker">SERIES DETAILS · {series.seasons.length} SEASONS</p>
          <h2>{series.title}</h2>
          <p className="detail-meta">{series.year} <span>·</span> {episodeCount} episodes <span>·</span> ★ {series.rating || 'Not rated'}</p>
          <p className="detail-genre">{series.genres.join(' / ') || 'Genre not listed'}</p>
          <p className="detail-overview">{series.overview || 'No series synopsis is available.'}</p>
          <p className="detail-people"><strong>Cast</strong>{series.cast.join(', ') || 'Not listed'}</p>
        </div>
      </div>

      <section className="series-episodes" aria-labelledby="series-episodes-title">
        <div className="series-episodes-heading">
          <div><p className="section-kicker">EPISODE GUIDE</p><h3 id="series-episodes-title">Seasons and episodes</h3></div>
          <span>{episodeCount} episodes</span>
        </div>
        <div className="series-season-list">
          {series.seasons.map((season) => (
            <details className="series-season" key={season.number}>
              <summary><span>{season.number === 0 ? 'Specials' : `Season ${season.number}`}</span><span>{season.episodes.length} episodes <i aria-hidden="true">⌄</i></span></summary>
              <div className="series-episode-list">
                {season.episodes.map((episode, index) => (
                  <article className="series-episode" key={`${season.number}-${episode.number ?? index}-${episode.title}`}>
                    <div className="series-episode-heading">
                      <h4>{episode.number ? `Episode ${episode.number}: ` : ''}{episode.title}</h4>
                      <span>{formatAirDate(episode.airDate)}{episode.runtime ? ` · ${episode.runtime} min` : ''}</span>
                    </div>
                    <p>{episode.overview || 'No episode description is available.'}</p>
                  </article>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="series-attribution"><span>TV series and episode information from</span> <a href={series.sourceUrl} target="_blank" rel="noreferrer">TVmaze</a><span>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</span></div>
    </section>
  )
}
