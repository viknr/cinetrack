import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

type SignUpPageProps = {
  onSignUp: (displayName: string, email: string, password: string) => Promise<string | null>
}

export function SignUpPage({ onSignUp }: SignUpPageProps) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = displayName.trim()
    if (name.length < 2) return setError('Enter a name with at least 2 characters.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address.')
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return setError('Use at least 8 characters, with an uppercase letter, a lowercase letter and a number.')
    }
    if (password !== confirmPassword) return setError('The passwords do not match.')

    setIsSubmitting(true)
    try {
      const registrationError = await onSignUp(name, email, password)
      if (registrationError) setError(registrationError)
    } catch {
      setError('We could not create an account in this browser. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="signin-page">
      <div className="signin-card signup-card">
        <div className="signin-mark" aria-hidden="true">C</div>
        <p className="section-kicker">JOIN CINETRACK</p>
        <h1>Create your account.</h1>
        <p className="signin-intro">Make a personal space for the films you love and want to see.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="signup-name">Your name</label>
          <input id="signup-name" autoComplete="name" autoFocus value={displayName} onChange={(event) => { setDisplayName(event.target.value); setError('') }} placeholder="Alex Morgan" />
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="you@example.com" />
          <label htmlFor="signup-password">Create a password</label>
          <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} placeholder="At least 8 characters" />
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input id="signup-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setError('') }} placeholder="Enter it again" />
          {error && <small className="field-error" role="alert">{error}</small>}
          <button className="signin-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'} <span aria-hidden="true">→</span></button>
        </form>
        <p className="signup-storage-note">This coursework demo saves your account in this browser only. It stores a salted password verifier, not your password. Don’t reuse a real password; this is not a secure online account service.</p>
        <p className="signin-switch">Already have an account? <Link to="/signin">Sign in</Link></p>
      </div>
    </section>
  )
}
