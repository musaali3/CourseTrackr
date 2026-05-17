import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, BookOpen } from 'lucide-react'
import AssessmentList from './AssessmentList.jsx'
import AssessmentForm from './AssessmentForm.jsx'
import './CourseCard.css'

function CourseCard({ course, apiUrl, onCourseDeleted, onAssessmentChange }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${course.name}"? This will also delete all assessments.`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`${apiUrl}/courses/${course.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      onCourseDeleted()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const getGradeColor = (grade) => {
    if (!grade) return '#555'
    if (grade >= 90) return '#10b981'
    if (grade >= 80) return '#3b82f6'
    if (grade >= 70) return '#f59e0b'
    if (grade >= 60) return '#f97316'
    return '#ef4444'
  }

  const assessments = course.assessments || []

  const totalWeight = assessments.reduce((sum, assessment) => {
    return sum + Number(assessment.weight || 0)
  }, 0)

  const weightedGrade = assessments.reduce((sum, assessment) => {
    return sum + Number(assessment.grade || 0) * Number(assessment.weight || 0)
  }, 0)

  const averageGrade = totalWeight > 0 ? weightedGrade / totalWeight : null

  const gradeColor = getGradeColor(averageGrade)
  
  return (
    <div className={`course-card ${expanded ? 'expanded' : ''}`}>
      <div className="course-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="course-info">
          <div className="course-icon">
            <BookOpen size={20} />
          </div>
          <div className="course-details">
            <h3 className="course-name">{course.name}</h3>
            <span className="course-credits">Course</span>
          </div>
        </div>

        <div className="course-meta">
          <div className="course-grade" style={{ color: gradeColor }}>
            {averageGrade !== null && averageGrade !== undefined ? (
              <>
                <span className="grade-value">{Number(averageGrade).toFixed(1)}%</span>
                <span className="grade-letter">{course.letter_grade || '-'}</span>
              </>
              ) : (
              <span className="no-grade">No grades</span>
              )}
          </div>

          <div className="course-actions">
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              disabled={deleting}
              title="Delete course"
            >
              <Trash2 size={16} />
            </button>

            <button className="expand-btn">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="course-card-content">
          <AssessmentForm
            courseId={course.id}
            apiUrl={apiUrl}
            onAssessmentAdded={onAssessmentChange}
          />
          
          <AssessmentList
            assessments={course.assessments || []}
            courseId={course.id}
            apiUrl={apiUrl}
            onAssessmentDeleted={onAssessmentChange}
          />
        </div>
      )}
    </div>
  )
}

export default CourseCard
