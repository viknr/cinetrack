import { beforeEach, describe, expect, it } from 'vitest'
import { makeMovie } from '../test/fixtures'
import { getCollectionStorageKey, useMovieStore } from './movieStore'

describe('movieStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useMovieStore.setState({ activeUserId: null, movies: [], isLoadingCatalogue: false, catalogueError: '' })
  })

  it('keeps each account’s saved collection separate', () => {
    const store = useMovieStore.getState()
    store.setActiveUser('alex@example.test')
    store.addMovie(makeMovie())
    store.addMovie(makeMovie({ id: 2, title: 'Dune: Part Two' }))

    const alexCollection = window.localStorage.getItem(getCollectionStorageKey('alex@example.test'))
    expect(alexCollection).toContain('Arrival')
    expect(alexCollection).toContain('Dune: Part Two')

    useMovieStore.getState().setActiveUser('sam@example.test')
    expect(useMovieStore.getState().movies).toEqual([])
    useMovieStore.getState().addMovie(makeMovie({ id: 3, title: 'Past Lives' }))

    const samCollection = window.localStorage.getItem(getCollectionStorageKey('sam@example.test'))
    const samMovies = JSON.parse(samCollection ?? '[]') as Array<{ title: string }>
    expect(samMovies.map((movie) => movie.title)).toEqual(['Past Lives'])
    expect(window.localStorage.getItem(getCollectionStorageKey('alex@example.test'))).toBe(alexCollection)
  })

  it('updates and deletes movies in the active account’s collection', () => {
    const store = useMovieStore.getState()
    store.setActiveUser('alex@example.test')
    store.addMovie(makeMovie())

    useMovieStore.getState().updateMovie(1, { title: 'Arrival (edited)' })
    expect(useMovieStore.getState().movies[0].title).toBe('Arrival (edited)')

    useMovieStore.getState().deleteMovie(1)
    expect(useMovieStore.getState().movies).toEqual([])
    expect(JSON.parse(window.localStorage.getItem(getCollectionStorageKey('alex@example.test')) ?? '[]')).toEqual([])
  })
})
