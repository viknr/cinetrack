import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MovieForm } from './MovieForm'

describe('MovieForm', () => {
  it('shows validation messages and does not save incomplete movie details', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<MovieForm onSave={onSave} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add movie' }))

    expect(screen.getByText('Enter a movie title.')).toBeInTheDocument()
    expect(screen.getByText(/Enter a year from 1888/)).toBeInTheDocument()
    expect(screen.getByText('Enter at least one genre.')).toBeInTheDocument()
    expect(screen.getByText('Rating must be between 0 and 10.')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('saves a valid movie with normalized fields', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<MovieForm onSave={onSave} onClose={vi.fn()} />)

    await user.type(screen.getByLabelText('Title'), 'Arrival')
    fireEvent.change(screen.getByLabelText('Release year'), { target: { value: '2016' } })
    await user.type(screen.getByLabelText('Genre'), 'Sci-fi')
    fireEvent.change(screen.getByLabelText('Rating (0–10)'), { target: { value: '8.5' } })
    await user.type(screen.getByLabelText('Poster image URL'), 'https://example.com/arrival.jpg')
    await user.click(screen.getByRole('button', { name: 'Add movie' }))

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Arrival',
      year: 2016,
      genre: 'Sci-fi',
      rating: '8.5',
      posterUrl: 'https://example.com/arrival.jpg',
      status: 'watchlist',
    }))
  })
})
