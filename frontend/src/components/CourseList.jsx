import CourseCard from './CourseCard.jsx'
import './CourseList.css'

function CourseList({ courses, apiUrl, onCourseDeleted, onAssessmentChange }) {
  if (courses.length === 0) {
    return (
      <div className="course-list-empty">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <path d="M12 6v4m0 4h.01"></path>
          </svg>
        </div>
        <h3>No courses yet</h3>
        <p>Add your first course above to start tracking your GPA</p>
      </div>
    )
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          apiUrl={apiUrl}
          onCourseDeleted={onCourseDeleted}
          onAssessmentChange={onAssessmentChange}
        />
      ))}
    </div>
  )
}

export default CourseList
