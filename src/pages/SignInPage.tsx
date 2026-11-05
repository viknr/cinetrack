import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

type SignInPageProps = {
  onSignIn: (email: string, password: string) => Promise<boolean>
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter both your email and password.')
      return
    }
    setIsSubmitting(true)
    try {
      if (!await onSignIn(email, password)) setError('Those sign-in details do not match. Check them or create an account.')
    } catch {
      setError('We could not sign you in on this browser. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="signin-page">
      <div className="signin-card">
        <div className="signin-mark" aria-hidden="true">C</div>
        <p className="section-kicker">WELCOME TO CINETRACK</p>
        <h1>Make it your movie space.</h1>
        <p className="signin-intro">Sign in to manage your watchlist and keep track of the films you’ve watched.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="signin-email">Email address</label>
          <input id="signin-email" type="email" autoComplete="username" autoFocus value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'signin-error' : 'signin-help'} placeholder="you@example.com" />
          <label htmlFor="signin-password">Password</label>
          <input id="signin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'signin-error' : 'signin-help'} placeholder="Enter the demo password" />
          {error && <small id="signin-error" className="field-error" role="alert">{error}</small>}
          <button className="signin-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button>
        </form>
        <div className="signin-demo-box" id="signin-help"><strong>Demo account</strong><span>Email: <code>demo@cinetrack.local</code></span><span>Password: <code>FilmNight2026!</code></span></div>
        <p className="signin-demo-note">Coursework simulation · credentials are checked in this browser and are never sent to a server</p>
        <p className="signin-switch">New to CineTrack? <Link to="/signup">Create an account</Link></p>
      </div>
    </section>
  )
}
