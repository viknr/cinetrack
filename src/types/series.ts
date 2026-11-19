export type SeriesEpisode = {
  number: number | null
  title: string
  airDate: string | null
  runtime: number | null
  overview: string
}

export type SeriesSeason = {
  number: number
  episodes: SeriesEpisode[]
}

export type CatalogueSeries = {
  id: number
  title: string
  year: number
  ended: string | null
  genres: string[]
  rating: string
  overview: string
  posterUrl: string
  cast: string[]
  seasons: SeriesSeason[]
  sourceUrl: string
}
