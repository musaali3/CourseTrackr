import AssessmentItem from './AssessmentItem.jsx'
import './AssessmentList.css'

function AssessmentList({ assessments, courseId, apiUrl, userKey, onAssessmentDeleted }) {
  if (assessments.length === 0) {
    return (
      <div className="assessment-list-empty">
        <p>No assessments yet. Add one above!</p>
      </div>
    )
  }

  const totalWeight = assessments.reduce((sum, a) => sum + a.weight, 0)

  return (
    <div className="assessment-list">
      <div className="assessment-list-header">
        <span>Assessment</span>
        <span>Grade</span>
        <span>Weight</span>
        <span></span>
      </div>
      
      {assessments.map((assessment) => (
        <AssessmentItem
          key={assessment.id}
          assessment={assessment}
          courseId={courseId}
          apiUrl={apiUrl}
          userKey={userKey}
          onDeleted={onAssessmentDeleted}
        />
      ))}

      <div className="assessment-list-footer">
        <span>Total Weight</span>
        <span className={totalWeight > 100 ? 'weight-over' : totalWeight === 100 ? 'weight-complete' : ''}>
          {totalWeight.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export default AssessmentList
