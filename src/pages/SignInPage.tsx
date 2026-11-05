import { useState, type FormEvent } from 'react'

type SignInPageProps = {
  onSignIn: (displayName: string) => void
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = displayName.trim()
    if (name.length < 2) {
      setError('Please enter a name with at least 2 characters.')
      return
    }
    onSignIn(name)
  }

  return (
    <section className="signin-page">
      <div className="signin-card">
        <div className="signin-mark" aria-hidden="true">C</div>
        <p className="section-kicker">WELCOME TO CINETRACK</p>
        <h1>Make it your movie space.</h1>
        <p className="signin-intro">Sign in to manage your watchlist and keep track of the films you’ve watched.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="signin-name">Your name</label>
          <input id="signin-name" autoComplete="name" autoFocus value={displayName} onChange={(event) => { setDisplayName(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'signin-error' : 'signin-help'} placeholder="e.g. Alex Morgan" />
          {error ? <small id="signin-error" className="field-error" role="alert">{error}</small> : <small id="signin-help" className="signin-help">This coursework demo uses a local simulated session. No password is needed.</small>}
          <button className="signin-submit" type="submit">Continue <span aria-hidden="true">→</span></button>
        </form>
        <p className="signin-demo-note">Demo sign-in only · your session stays in this browser</p>
      </div>
    </section>
  )
}
