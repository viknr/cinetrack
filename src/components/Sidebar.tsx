import { NavLink } from 'react-router-dom'

type SidebarProps = { watchlistCount: number }

const links = [
  { label: 'Dashboard', icon: '◫', to: '/' },
  { label: 'Discover', icon: '⌕', to: '/discover' },
  { label: 'My watchlist', icon: '▤', to: '/watchlist' },
  { label: 'Watched', icon: '✓', to: '/watched' },
]

export function Sidebar({ watchlistCount }: SidebarProps) {
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/" aria-label="CineTrack home">
        <span className="brand-mark">C</span><span>cine<span className="brand-light">track</span></span>
      </NavLink>
      <p className="nav-label">MENU</p>
      <nav className="side-nav" aria-label="Main navigation">
        {links.map(({ label, icon, to }) => (
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end={to === '/'} to={to} key={label}>
            <span className="nav-icon" aria-hidden="true">{icon}</span>{label}
            {label === 'My watchlist' && <span className="nav-count">{watchlistCount}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="note-spark">✦</span><p>Your next favourite<br />film is waiting.</p><NavLink className="sidebar-explore" to="/discover">Explore movies <span aria-hidden="true">↗</span></NavLink></div>
        <button className="profile"><span className="avatar">A</span><span className="profile-copy"><strong>Alex Morgan</strong><small>Film enthusiast</small></span><span className="profile-more">···</span></button>
      </div>
    </aside>
  )
}
