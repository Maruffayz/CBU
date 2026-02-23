import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>
          Finance Manager
        </div>
        <Navbar />
      </aside>
      <div className="app-main">
        <header className="app-header">
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Personal Finance Dashboard</h1>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

export default Layout
