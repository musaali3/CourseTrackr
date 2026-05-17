import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import './CourseInput.css'

function CourseInput({ apiUrl, onCourseAdded }) {
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim() || !credits) {
      setError('Please fill in all fields')
      return
    }

    const creditValue = parseFloat(credits)
    if (isNaN(creditValue) || creditValue <= 0 || creditValue > 10) {
      setError('Credits must be between 0.5 and 10')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiUrl}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), credits: creditValue }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to add course')
      }

      setName('')
      setCredits('')
      onCourseAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="course-input-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="course-name">Course Name</label>
          <input
            id="course-name"
            type="text"
            placeholder="e.g., Calculus I"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-group credits-input">
          <label htmlFor="credits">Credits</label>
          <input
            id="credits"
            type="number"
            placeholder="3"
            min="0.5"
            max="10"
            step="0.5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="add-btn"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={20} className="spin" />
          ) : (
            <Plus size={20} />
          )}
          <span>Add Course</span>
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </form>
  )
}

export default CourseInput
