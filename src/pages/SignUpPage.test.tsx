import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SignUpPage } from './SignUpPage'

describe('SignUpPage', () => {
  it('rejects a password that does not meet the requirements', async () => {
    const user = userEvent.setup()
    const onSignUp = vi.fn().mockResolvedValue(null)
    render(<MemoryRouter><SignUpPage onSignUp={onSignUp} /></MemoryRouter>)

    await user.type(screen.getByLabelText('Your name'), 'Sam Lee')
    await user.type(screen.getByLabelText('Email address'), 'sam@example.test')
    await user.type(screen.getByLabelText('Create a password'), 'weakpass')
    await user.type(screen.getByLabelText('Confirm password'), 'weakpass')
    await user.click(screen.getByRole('button', { name: /Create account/ }))

    expect(screen.getByRole('alert')).toHaveTextContent(/at least 8 characters/)
    expect(onSignUp).not.toHaveBeenCalled()
  })

  it('submits valid account details to the sign-up handler', async () => {
    const user = userEvent.setup()
    const onSignUp = vi.fn().mockResolvedValue(null)
    render(<MemoryRouter><SignUpPage onSignUp={onSignUp} /></MemoryRouter>)

    await user.type(screen.getByLabelText('Your name'), 'Sam Lee')
    await user.type(screen.getByLabelText('Email address'), 'sam@example.test')
    await user.type(screen.getByLabelText('Create a password'), 'FilmNight2026')
    await user.type(screen.getByLabelText('Confirm password'), 'FilmNight2026')
    await user.click(screen.getByRole('button', { name: /Create account/ }))

    expect(onSignUp).toHaveBeenCalledWith('Sam Lee', 'sam@example.test', 'FilmNight2026')
  })
})
