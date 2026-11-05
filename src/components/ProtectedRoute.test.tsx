import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'

function renderPrivatePage(isAuthenticated: boolean) {
  return render(
    <MemoryRouter initialEntries={['/watchlist']}>
      <Routes>
        <Route path="/watchlist" element={<ProtectedRoute isAuthenticated={isAuthenticated}><h1>Your watchlist</h1></ProtectedRoute>} />
        <Route path="/signin" element={<h1>Sign in to continue</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects signed-out visitors to sign in', () => {
    renderPrivatePage(false)
    expect(screen.getByRole('heading', { name: 'Sign in to continue' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Your watchlist' })).not.toBeInTheDocument()
  })

  it('shows the private page to a signed-in visitor', () => {
    renderPrivatePage(true)
    expect(screen.getByRole('heading', { name: 'Your watchlist' })).toBeInTheDocument()
  })
})
