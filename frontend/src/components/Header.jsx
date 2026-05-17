import { GraduationCap } from 'lucide-react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <GraduationCap size={24} />
          </div>
          <span className="logo-text">GradeTrackr</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link active">Dashboard</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
