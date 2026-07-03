import { useMemo, useState } from 'react'
import './App.css'

const initialStudents = [
  {
    id: 1,
    name: 'Arun Kumar',
    rollNo: 'S101',
    grade: 'A',
    course: 'Computer Science',
    email: 'arun@example.com',
  },
  {
    id: 2,
    name: 'Meena Raj',
    rollNo: 'S102',
    grade: 'B',
    course: 'Mathematics',
    email: 'meena@example.com',
  },
]

const emptyForm = {
  name: '',
  rollNo: '',
  grade: 'A',
  course: '',
  email: '',
}

function App() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students')
    return savedStudents ? JSON.parse(savedStudents) : initialStudents
  })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')

  function saveStudents(nextStudents) {
    setStudents(nextStudents)
    localStorage.setItem('students', JSON.stringify(nextStudents))
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.rollNo.trim() || !form.course.trim()) {
      alert('Please fill name, roll number, and course.')
      return
    }

    if (editingId) {
      const updatedStudents = students.map((student) =>
        student.id === editingId ? { ...form, id: editingId } : student,
      )
      saveStudents(updatedStudents)
      setEditingId(null)
    } else {
      const newStudent = {
        ...form,
        id: Date.now(),
      }
      saveStudents([...students, newStudent])
    }

    setForm(emptyForm)
  }

  function editStudent(student) {
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      grade: student.grade,
      course: student.course,
      email: student.email,
    })
    setEditingId(student.id)
  }

  function deleteStudent(id) {
    const confirmed = confirm('Delete this student record?')

    if (confirmed) {
      saveStudents(students.filter((student) => student.id !== id))
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = searchText.toLowerCase()
      const matchesSearch =
        student.name.toLowerCase().includes(searchValue) ||
        student.rollNo.toLowerCase().includes(searchValue) ||
        student.course.toLowerCase().includes(searchValue)
      const matchesGrade =
        gradeFilter === 'All' || student.grade === gradeFilter

      return matchesSearch && matchesGrade
    })
  }, [students, searchText, gradeFilter])

  return (
    <main className="app">
      <section className="top-panel">
        <div>
          <p className="eyebrow">Homework 5</p>
          <h1>Student Data Management System</h1>
        </div>
        <div className="stats">
          <span>{students.length}</span>
          <p>Total Students</p>
        </div>
      </section>

      <section className="content-grid">
        <form className="student-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>

          <label>
            Student Name
            <input
              name="name"
              onChange={handleChange}
              placeholder="Enter student name"
              type="text"
              value={form.name}
            />
          </label>

          <label>
            Roll Number
            <input
              name="rollNo"
              onChange={handleChange}
              placeholder="Example: S103"
              type="text"
              value={form.rollNo}
            />
          </label>

          <label>
            Grade
            <select name="grade" onChange={handleChange} value={form.grade}>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </label>

          <label>
            Course
            <input
              name="course"
              onChange={handleChange}
              placeholder="Enter course"
              type="text"
              value={form.course}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              onChange={handleChange}
              placeholder="student@example.com"
              type="email"
              value={form.email}
            />
          </label>

          <div className="form-actions">
            <button type="submit">
              {editingId ? 'Update Student' : 'Add Student'}
            </button>
            {editingId && (
              <button className="secondary" onClick={cancelEdit} type="button">
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="records-panel">
          <div className="toolbar">
            <input
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by name, roll no, or course"
              type="search"
              value={searchText}
            />
            <select
              onChange={(event) => setGradeFilter(event.target.value)}
              value={gradeFilter}
            >
              <option>All</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Grade</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>
                      <span className="grade">{student.grade}</span>
                    </td>
                    <td>{student.course}</td>
                    <td>{student.email || 'Not added'}</td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => editStudent(student)} type="button">
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => deleteStudent(student.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <p className="empty-message">No student records found.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
