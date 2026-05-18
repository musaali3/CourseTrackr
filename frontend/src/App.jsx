import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Gpa from './components/Gpa.jsx'
import CourseInput from './components/CourseInput.jsx'
import CourseList from './components/CourseList.jsx'
import './App.css'

const API_URL = 'https://coursetrackr-backend.onrender.com'

function getUserkey() {
  let userKey = localStorage.getItem('gradetrackr_user_key')

  if (!userKey) {
    userKey = crypto.randomUUID()
    localStorage.setItem('gradetrackr_user_key', userKey)
  }

  return userKey
}

const USER_KEY = getUserkey()

function App() {
  const [courses, setCourses] = useState([])
  const [gpaData, setGpaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses`, {
        headers: {
          'X-User-Key': USER_KEY,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchGpa = async () => {
    try {
      const response = await fetch(`${API_URL}/gpa`, {
        headers: {
          'X-User-Key': USER_KEY,
        },
      })

      if (response.status === 404) {
        setGpaData(null)
        return
      }

      if (!response.ok) throw new Error('Failed to fetch GPA')

      const data = await response.json()
      setGpaData(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCourses(), fetchGpa()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleCourseAdded = async () => {
    await Promise.all([fetchCourses(), fetchGpa()])
  }

  const handleCourseDeleted = async () => {
    await Promise.all([fetchCourses(), fetchGpa()])
  }

  const handleAssessmentChange = async () => {
    await Promise.all([fetchCourses(), fetchGpa()])
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your courses...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}
          
          <Gpa gpaData={gpaData} />
          
          <section className="courses-section">
            <div className="section-header">
              <h2>Your Courses</h2>
              <span className="course-count">{courses.length} courses</span>
            </div>
            
            <CourseInput 
              apiUrl={API_URL} 
              userKey={USER_KEY}
              onCourseAdded={handleCourseAdded} 
            />
            
            <CourseList 
              courses={courses} 
              apiUrl={API_URL}
              userKey={USER_KEY}
              onCourseDeleted={handleCourseDeleted}
              onAssessmentChange={handleAssessmentChange}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
