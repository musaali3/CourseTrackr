import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import './AssessmentForm.css'

function AssessmentForm({ courseId, apiUrl, userKey, onAssessmentAdded }) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !grade || !weight) {
      setError('Please fill in all fields')
      return
    }

    const gradeValue = parseFloat(grade)
    const weightValue = parseFloat(weight)

    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      setError('Grade must be between 0 and 100')
      return
    }

    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 100) {
      setError('Weight must be between 0 and 100')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiUrl}/courses/${courseId}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'X-User-Key': userKey,
        },
        body: JSON.stringify({
          name: name.trim(),
          grade: gradeValue,
          weight: weightValue,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to add assessment')
      }

      setName('')
      setGrade('')
      setWeight('')
      onAssessmentAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="assessment-form" onSubmit={handleSubmit}>
      <h4 className="assessment-form-title">Add Assessment</h4>
      
      <div className="assessment-form-row">
        <div className="assessment-input-group">
          <label htmlFor={`assessment-name-${courseId}`}>Name</label>
          <input
            id={`assessment-name-${courseId}`}
            type="text"
            placeholder="e.g., Midterm Exam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="assessment-input-group small">
          <label htmlFor={`assessment-grade-${courseId}`}>Grade %</label>
          <input
            id={`assessment-grade-${courseId}`}
            type="number"
            placeholder="85"
            min="0"
            max="100"
            step="0.1"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="assessment-input-group small">
          <label htmlFor={`assessment-weight-${courseId}`}>Weight %</label>
          <input
            id={`assessment-weight-${courseId}`}
            type="number"
            placeholder="25"
            min="0"
            max="100"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="assessment-add-btn"
          disabled={loading}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Plus size={18} />}
        </button>
      </div>

      {error && <p className="assessment-error">{error}</p>}
    </form>
  )
}

export default AssessmentForm
