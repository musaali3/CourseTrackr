import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import './AssessmentItem.css'

function AssessmentItem({ assessment, courseId, apiUrl, userKey, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(
        `${apiUrl}/courses/${courseId}/assessments/${assessment.id}`,
        {
          method: 'DELETE',
          headers: {
            'X-User-Key': userKey,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete assessment')
      }

      onDeleted()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#10b981'
    if (grade >= 80) return '#3b82f6'
    if (grade >= 70) return '#f59e0b'
    if (grade >= 60) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="assessment-item">
      <span className="assessment-name">{assessment.name}</span>
      
      <span 
        className="assessment-grade" 
        style={{ color: getGradeColor(assessment.grade) }}
      >
        {assessment.grade.toFixed(1)}%
      </span>
      
      <span className="assessment-weight">{assessment.weight}%</span>
      
      <button
        className="assessment-delete-btn"
        onClick={handleDelete}
        disabled={deleting}
        title="Delete assessment"
      >
        {deleting ? (
          <Loader2 size={14} className="spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  )
}

export default AssessmentItem
