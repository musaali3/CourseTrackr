import { TrendingUp, BookOpen } from 'lucide-react'
import './Gpa.css'

function Gpa({ gpaData }) {
  if (!gpaData) {
    return (
      <div className="gpa-container">
        <div className="gpa-card gpa-main">
          <div className="gpa-empty">
            <p>Add courses to see your GPA</p>
          </div>
        </div>
      </div>
    )
  }

  const getGpaColor = (gpa) => {
    if (gpa >= 3.7) return '#10b981'
    if (gpa >= 3.0) return '#3b82f6'
    if (gpa >= 2.0) return '#f59e0b'
    return '#ef4444'
  }

  const getGpaLabel = (gpa) => {
    if (gpa >= 3.7) return 'Excellent'
    if (gpa >= 3.0) return 'Good'
    if (gpa >= 2.0) return 'Average'
    return 'Needs Improvement'
  }

  const gpaColor = getGpaColor(gpaData.overall_gpa)
  const progressPercent = (gpaData.overall_gpa / 4.0) * 100

  return (
    <div className="gpa-container">
      <div className="gpa-card gpa-main">
        <div className="gpa-header">
          <div className="gpa-icon" style={{ background: `linear-gradient(135deg, ${gpaColor} 0%, ${gpaColor}99 100%)` }}>
            <TrendingUp size={24} />
          </div>
          <div className="gpa-label-container">
            <span className="gpa-label">Overall GPA</span>
            <span className="gpa-status" style={{ color: gpaColor }}>{getGpaLabel(gpaData.overall_gpa)}</span>
          </div>
        </div>
        
        <div className="gpa-value-container">
          <span className="gpa-value" style={{ color: gpaColor }}>
            {gpaData.overall_gpa.toFixed(2)}
          </span>
          <span className="gpa-max">/ 4.00</span>
        </div>

        <div className="gpa-progress">
          <div 
            className="gpa-progress-bar" 
            style={{ 
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${gpaColor} 0%, ${gpaColor}cc 100%)`
            }}
          />
        </div>
      </div>

      <div className="gpa-stats">
        <div className="gpa-card gpa-stat">
          <div className="stat-icon">
            <BookOpen size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{gpaData.courses?.length || 0}</span>
            <span className="stat-label">Total Courses</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gpa
