import { useMemo, useState } from 'react'
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRoundCheck,
  Users,
  X,
} from 'lucide-react'
import './App.css'

const initialStudents = [
  {
    id: 1,
    name: 'Aarav Sharma',
    rollNo: 'STU-1001',
    className: 'Grade 10',
    section: 'A',
    guardian: 'Meera Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    attendance: 96,
    grade: 'A',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Diya Patel',
    rollNo: 'STU-1002',
    className: 'Grade 9',
    section: 'B',
    guardian: 'Rohan Patel',
    email: 'diya.patel@example.com',
    phone: '9876501234',
    attendance: 91,
    grade: 'A',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Kabir Khan',
    rollNo: 'STU-1003',
    className: 'Grade 8',
    section: 'C',
    guardian: 'Sana Khan',
    email: 'kabir.khan@example.com',
    phone: '9123456780',
    attendance: 84,
    grade: 'B',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Nila Iyer',
    rollNo: 'STU-1004',
    className: 'Grade 10',
    section: 'B',
    guardian: 'Arun Iyer',
    email: 'nila.iyer@example.com',
    phone: '9988776655',
    attendance: 72,
    grade: 'C',
    status: 'On Leave',
  },
]

const emptyForm = {
  name: '',
  rollNo: '',
  className: 'Grade 10',
  section: 'A',
  guardian: '',
  email: '',
  phone: '',
  attendance: '',
  grade: 'A',
  status: 'Active',
}

function App() {
  const [students, setStudents] = useState(initialStudents)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const classes = useMemo(
    () => ['All', ...new Set(students.map((student) => student.className))],
    [students],
  )

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.guardian.toLowerCase().includes(query)
      const matchesClass =
        classFilter === 'All' || student.className === classFilter
      const matchesStatus =
        statusFilter === 'All' || student.status === statusFilter

      return matchesSearch && matchesClass && matchesStatus
    })
  }, [classFilter, searchTerm, statusFilter, students])

  const averageAttendance = Math.round(
    students.reduce((total, student) => total + Number(student.attendance), 0) /
      students.length,
  )
  const activeStudents = students.filter(
    (student) => student.status === 'Active',
  ).length
  const topGrades = students.filter((student) => student.grade === 'A').length

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const preparedStudent = {
      ...formData,
      attendance: Math.min(100, Math.max(0, Number(formData.attendance))),
    }

    if (editingId) {
      setStudents((current) =>
        current.map((student) =>
          student.id === editingId ? { ...preparedStudent, id: editingId } : student,
        ),
      )
    } else {
      setStudents((current) => [
        { ...preparedStudent, id: Date.now() },
        ...current,
      ])
    }

    setEditingId(null)
    setFormData(emptyForm)
  }

  function startEdit(student) {
    setEditingId(student.id)
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      className: student.className,
      section: student.section,
      guardian: student.guardian,
      email: student.email,
      phone: student.phone,
      attendance: String(student.attendance),
      grade: student.grade,
      status: student.status,
    })
  }

  function deleteStudent(studentId) {
    setStudents((current) =>
      current.filter((student) => student.id !== studentId),
    )

    if (editingId === studentId) {
      setEditingId(null)
      setFormData(emptyForm)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData(emptyForm)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Academic dashboard</p>
          <h1>Student Management System</h1>
        </div>
        <div className="school-badge">
          <GraduationCap size={24} aria-hidden="true" />
          <span>Greenfield School</span>
        </div>
      </header>

      <section className="stats-grid" aria-label="Student statistics">
        <article className="stat-card">
          <Users size={22} aria-hidden="true" />
          <div>
            <span>Total Students</span>
            <strong>{students.length}</strong>
          </div>
        </article>
        <article className="stat-card">
          <UserRoundCheck size={22} aria-hidden="true" />
          <div>
            <span>Active</span>
            <strong>{activeStudents}</strong>
          </div>
        </article>
        <article className="stat-card">
          <CalendarDays size={22} aria-hidden="true" />
          <div>
            <span>Avg Attendance</span>
            <strong>{averageAttendance || 0}%</strong>
          </div>
        </article>
        <article className="stat-card">
          <BookOpen size={22} aria-hidden="true" />
          <div>
            <span>A Grade</span>
            <strong>{topGrades}</strong>
          </div>
        </article>
      </section>

      <section className="workspace">
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="section-title">
            <div>
              <p className="eyebrow">Student details</p>
              <h2>{editingId ? 'Edit student' : 'Add new student'}</h2>
            </div>
            {editingId && (
              <button
                className="icon-button"
                type="button"
                onClick={cancelEdit}
                aria-label="Cancel editing"
                title="Cancel editing"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          <label>
            Full name
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
            />
          </label>

          <div className="two-column">
            <label>
              Roll number
              <input
                required
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="STU-1005"
              />
            </label>
            <label>
              Class
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </label>
          </div>

          <div className="two-column">
            <label>
              Section
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </label>
            <label>
              Grade
              <select name="grade" value={formData.grade} onChange={handleChange}>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </label>
          </div>

          <label>
            Guardian
            <input
              required
              name="guardian"
              value={formData.guardian}
              onChange={handleChange}
              placeholder="Parent or guardian"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
            />
          </label>

          <div className="two-column">
            <label>
              Phone
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </label>
            <label>
              Attendance %
              <input
                required
                type="number"
                min="0"
                max="100"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                placeholder="95"
              />
            </label>
          </div>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </label>

          <button className="primary-button" type="submit">
            {editingId ? <CheckCircle2 size={18} /> : <Plus size={18} />}
            {editingId ? 'Update student' : 'Add student'}
          </button>
        </form>

        <section className="student-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Directory</p>
              <h2>Student records</h2>
            </div>
            <span>{filteredStudents.length} shown</span>
          </div>

          <div className="filters" aria-label="Student filters">
            <label className="search-field">
              <Search size={18} aria-hidden="true" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, roll no, guardian"
              />
            </label>
            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              aria-label="Filter by class"
            >
              {classes.map((className) => (
                <option key={className}>{className}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Guardian</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <span>{student.name.charAt(0)}</span>
                        <div>
                          <strong>{student.name}</strong>
                          <small>{student.rollNo}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {student.className} - {student.section}
                      <small>Grade {student.grade}</small>
                    </td>
                    <td>
                      {student.guardian}
                      <small>
                        <Mail size={13} aria-hidden="true" />
                        {student.email}
                      </small>
                    </td>
                    <td>
                      <div className="attendance">
                        <span style={{ width: `${student.attendance}%` }} />
                      </div>
                      <small>{student.attendance}% present</small>
                    </td>
                    <td>
                      <span className={`status ${student.status.toLowerCase().replace(' ', '-')}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() => startEdit(student)}
                          aria-label={`Edit ${student.name}`}
                          title="Edit student"
                        >
                          <Pencil size={17} aria-hidden="true" />
                        </button>
                        <button
                          className="icon-button danger"
                          type="button"
                          onClick={() => deleteStudent(student.id)}
                          aria-label={`Delete ${student.name}`}
                          title="Delete student"
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="empty-state">
                <Search size={28} aria-hidden="true" />
                <p>No students match your filters.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
