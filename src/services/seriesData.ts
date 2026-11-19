import type { CatalogueSeries } from '../types/series'

export async function fetchSeriesCatalogue(): Promise<CatalogueSeries[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/series.json`)
  if (!response.ok) {
    throw new Error('We could not load the TV series catalogue. Please try again.')
  }

  const series = await response.json() as CatalogueSeries[]
  if (!Array.isArray(series)) {
    throw new Error('The TV series catalogue has an unexpected format.')
  }

  return series
}
