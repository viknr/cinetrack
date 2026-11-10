import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return <EmptyState className="route-not-found" icon="404" title="This page wandered off" description="The link may be old, or the page may not exist." action={<Link className="retry-button" to="/">Go to dashboard</Link>} />
}
