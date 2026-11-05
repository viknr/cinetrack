type SidebarProps = {
  activePage: string
  watchlistCount: number
  onNavigate: (page: string) => void
}

const links = [
  { label: 'Dashboard', icon: '◫' },
  { label: 'Discover', icon: '⌕' },
  { label: 'My watchlist', icon: '▤' },
  { label: 'Watched', icon: '✓' },
]

export function Sidebar({ activePage, watchlistCount, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#dashboard" onClick={() => onNavigate('Dashboard')} aria-label="CineTrack home">
        <span className="brand-mark">C</span><span>cine<span className="brand-light">track</span></span>
      </a>
      <p className="nav-label">MENU</p>
      <nav className="side-nav" aria-label="Main navigation">
        {links.map(({ label, icon }) => (
          <button className={`nav-link ${activePage === label ? 'active' : ''}`} key={label} onClick={() => onNavigate(label)}>
            <span className="nav-icon" aria-hidden="true">{icon}</span>{label}
            {label === 'My watchlist' && <span className="nav-count">{watchlistCount}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="note-spark">✦</span><p>Your next favourite<br />film is waiting.</p><button onClick={() => onNavigate('Discover')}>Explore movies <span aria-hidden="true">↗</span></button></div>
        <button className="profile"><span className="avatar">A</span><span className="profile-copy"><strong>Alex Morgan</strong><small>Film enthusiast</small></span><span className="profile-more">···</span></button>
      </div>
    </aside>
  )
}
