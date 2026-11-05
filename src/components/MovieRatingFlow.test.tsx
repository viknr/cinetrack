import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { makeMovie } from '../test/fixtures'
import { MovieRatingFlow } from './MovieRatingFlow'

describe('MovieRatingFlow', () => {
  it('saves each selected score and advances through the collection', async () => {
    const user = userEvent.setup()
    const onRate = vi.fn()
    const movies = [makeMovie(), makeMovie({ id: 2, title: 'Dune: Part Two' })]
    render(<MovieRatingFlow movies={movies} onRate={onRate} onClose={vi.fn()} />)

    expect(screen.getByText('Movie 1 of 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '8 out of 10 stars' }))
    await user.click(screen.getByRole('button', { name: 'Save & next' }))

    expect(onRate).toHaveBeenCalledWith(1, 8)
    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument()
    expect(screen.getByText('Movie 2 of 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '10 out of 10 stars' }))
    await user.click(screen.getByRole('button', { name: 'Save rating' }))
    expect(onRate).toHaveBeenLastCalledWith(2, 10)
    expect(screen.getByText('You’re all caught up')).toBeInTheDocument()
  })
})
