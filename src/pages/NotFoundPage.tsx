import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="empty-state route-not-found"><span>404</span><h3>This page wandered off</h3><p>The link may be old, or the page may not exist.</p><Link className="retry-button" to="/">Go to dashboard</Link></div>
}
