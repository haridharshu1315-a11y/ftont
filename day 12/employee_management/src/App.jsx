import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from './services/employeeApi'

const emptyEmployee = { name: '', email: '', department: 'Engineering', role: '', salary: '', dob: '', date_of_hire: '' }

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 3 3 5-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20.3h-3v-.09A1.7 1.7 0 0 0 10.68 18.7a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7.02 15a1.7 1.7 0 0 0-1.55-1.03H5.4v-3h.07A1.7 1.7 0 0 0 7.02 9.94a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V4.7h3v.03a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 8l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1.03h.07v3h-.07A1.7 1.7 0 0 0 19.4 15Z" /></>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyEmployee)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [menu, setMenu] = useState(null)
  const [activeView, setActiveView] = useState('employees')

  const loadEmployees = async () => {
    setLoading(true); setApiError('')
    try { setEmployees(await getEmployees()) } catch { setApiError('Unable to load employees. Check your internet connection and MockAPI endpoint.') } finally { setLoading(false) }
  }
  useEffect(() => {
    let active = true
    getEmployees()
      .then((items) => { if (active) setEmployees(items) })
      .catch(() => { if (active) setApiError('Unable to load employees. Check your internet connection and MockAPI endpoint.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 2500); return () => clearTimeout(timer) } }, [notice])

  const departments = useMemo(() => [...new Set(employees.map((e) => e.department))].sort(), [employees])
  const departmentOptions = useMemo(() => ['All departments', ...departments], [departments])
  const departmentSummaries = useMemo(() => {
    const grouped = employees.reduce((acc, employee) => {
      const departmentName = employee.department || 'Unassigned'
      if (!acc[departmentName]) acc[departmentName] = { name: departmentName, count: 0, totalSalary: 0 }
      acc[departmentName].count += 1
      acc[departmentName].totalSalary += Number(employee.salary) || 0
      return acc
    }, {})

    return Object.values(grouped)
      .map((item) => ({ ...item, avgSalary: item.count ? Math.round(item.totalSalary / item.count) : 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [employees])
  const reportSummary = useMemo(() => {
    const totalSalary = employees.reduce((sum, employee) => sum + Number(employee.salary || 0), 0)
    return {
      totalEmployees: employees.length,
      departments: departments.length,
      averageSalary: employees.length ? Math.round(totalSalary / employees.length) : 0,
      highestSalary: employees.reduce((max, employee) => Number(employee.salary || 0) > max ? Number(employee.salary || 0) : max, 0),
    }
  }, [employees, departments])
  const filtered = useMemo(() => employees.filter((employee) => {
    const matchesSearch = `${employee.name} ${employee.email} ${employee.role}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (department === 'All departments' || employee.department === department)
  }), [employees, search, department])

  const openAdd = () => { setForm(emptyEmployee); setError(''); setModal('add') }
  const openEdit = (employee) => { setForm({ ...employee, salary: String(employee.salary) }); setError(''); setMenu(null); setModal('edit') }
  const submit = async (event) => {
    event.preventDefault()
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.')
    if (!form.name.trim() || !form.role.trim()) return setError('Name and role are required.')
    if (modal === 'add' && (!form.email || !form.date_of_hire)) return setError('Email and date of hire are required for new employees.')
    if (Number(form.salary) < 0 || form.salary === '') return setError('Salary must be a non-negative number.')
    const payload = { name: form.name.trim(), email: form.email.trim(), department: form.department, role: form.role.trim(), salary: Number(form.salary), dob: form.dob, date_of_hire: form.date_of_hire }
    try {
      if (modal === 'add') { const created = await createEmployee(payload); setEmployees((current) => [...current, created]); setNotice('Employee added successfully.') }
      else { const updated = await updateEmployee(form.id, payload); setEmployees((current) => current.map((employee) => employee.id === form.id ? updated : employee)); setNotice('Employee details updated.') }
      setModal(null)
    } catch { setError('Could not save employee. Please try again.') }
  }
  const removeEmployee = async (employee) => { try { await deleteEmployee(employee.id); setEmployees((current) => current.filter((item) => item.id !== employee.id)); setMenu(null); setNotice(`${employee.name} was removed.`) } catch { setMenu(null); setApiError('Could not delete employee. Please try again.') } }
  const formatDate = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`))

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">P</span><span>people<span>hub</span></span></div>
      <nav>
        <button type="button" className={`nav-item ${activeView === 'employees' ? 'active' : ''}`} onClick={() => setActiveView('employees')}><Icon name="users" />Employees</button>
        <button type="button" className={`nav-item ${activeView === 'departments' ? 'active' : ''}`} onClick={() => setActiveView('departments')}><Icon name="grid" />Departments</button>
        <button type="button" className={`nav-item ${activeView === 'reports' ? 'active' : ''}`} onClick={() => setActiveView('reports')}><Icon name="chart" />Reports</button>
      </nav>
      <div className="sidebar-bottom"><button type="button" id="nav-settings" className="nav-item"><Icon name="settings" />Settings</button><div className="profile"><div className="avatar avatar-small">AH</div><div><strong>Alex Harris</strong><small>Administrator</small></div><Icon name="dots" /></div></div>
    </aside>
    <main>
      <header><div><p className="eyebrow">WORKSPACE / DIRECTORY</p><h1>{activeView === 'departments' ? 'Departments' : activeView === 'reports' ? 'Reports' : 'Employees'}</h1><p className="subheading">{activeView === 'departments' ? 'Review department distribution and team sizes.' : activeView === 'reports' ? 'Track workforce highlights and salary trends.' : 'Manage your team and their information.'}</p></div>{activeView === 'employees' && <button id="add-employee-btn" className="primary-button" onClick={openAdd}><Icon name="plus" size={18} /> Add employee</button>}</header>
      {activeView === 'employees' ? <>
        <section className="stats"><div className="stat"><div className="stat-icon purple"><Icon name="users" /></div><div><span>Total employees</span><strong>{employees.length}</strong></div></div><div className="stat"><div className="stat-icon blue"><Icon name="grid" /></div><div><span>Departments</span><strong>{departments.length}</strong></div></div><div className="stat"><div className="stat-icon orange"><Icon name="chart" /></div><div><span>Average salary</span><strong>${employees.length ? Math.round(employees.reduce((sum, item) => sum + Number(item.salary), 0) / employees.length / 1000) : 0}k</strong></div></div></section>
        <section className="directory"><div className="directory-heading"><div><h2>Team directory</h2><p>{filtered.length} {filtered.length === 1 ? 'employee' : 'employees'}</p></div><div className="filters"><label className="search"><Icon name="search" size={18} /><input id="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees" /></label><label className="filter-select"><span>Department</span><select id="dept-filter" value={department} onChange={(e) => setDepartment(e.target.value)}>{departmentOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div></div>
          <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>ROLE</th><th>SALARY</th><th>DATE OF BIRTH</th><th>DATE OF HIRE</th><th aria-label="Actions"></th></tr></thead><tbody>{filtered.map((employee) => <tr key={employee.id}><td><div className="person"><div className={`avatar ${employee.color}`}>{employee.initials}</div><div><strong>{employee.name}</strong><small>{employee.email || 'No email added'}</small></div></div></td><td><span className="pill">{employee.department}</span></td><td>{employee.role || '—'}</td><td className="salary">{employee.salary ? `$${Number(employee.salary).toLocaleString('en-US')}` : '—'}</td><td>{employee.dob ? formatDate(employee.dob) : '—'}</td><td>{employee.date_of_hire ? formatDate(employee.date_of_hire) : '—'}</td><td className="actions"><button id={`action-menu-${employee.id}`} className="icon-button" onClick={() => setMenu(menu === employee.id ? null : employee.id)} aria-label={`Actions for ${employee.name}`}><Icon name="dots" /></button>{menu === employee.id && <div className="action-menu"><button id={`edit-btn-${employee.id}`} onClick={() => openEdit(employee)}><Icon name="edit" size={16} /> Edit employee</button><button id={`delete-btn-${employee.id}`} className="danger" onClick={() => removeEmployee(employee)}><Icon name="trash" size={16} /> Delete employee</button></div>}</td></tr>)}</tbody></table>{loading && <div className="empty-state"><h3>Loading employees…</h3><p>Fetching the latest directory from MockAPI.</p></div>}{apiError && <div className="empty-state api-error"><h3>Something went wrong</h3><p>{apiError}</p><button className="secondary-button" onClick={loadEmployees}>Try again</button></div>}{!loading && !apiError && filtered.length === 0 && <div className="empty-state"><Icon name="search" size={28} /><h3>No employees found</h3><p>Try changing your search or department filter.</p></div>}</div>
        </section>
      </> : activeView === 'departments' ? <section className="content-panel"><div className="panel-header"><div><h2>Department overview</h2><p>See which teams are growing and how salary is distributed.</p></div></div><div className="card-grid">{departmentSummaries.map((item) => <div className="info-card" key={item.name}><h3>{item.name}</h3><p>{item.count} employees</p><strong>Avg salary: ${item.avgSalary.toLocaleString('en-US')}</strong></div>)}</div></section> : <section className="content-panel"><div className="panel-header"><div><h2>Reports snapshot</h2><p>High-level workforce insights at a glance.</p></div></div><div className="card-grid"><div className="info-card"><h3>Total employees</h3><p>{reportSummary.totalEmployees}</p><strong>Across {reportSummary.departments} departments</strong></div><div className="info-card"><h3>Average salary</h3><p>${reportSummary.averageSalary.toLocaleString('en-US')}</p><strong>Per employee</strong></div><div className="info-card"><h3>Highest salary</h3><p>${reportSummary.highestSalary.toLocaleString('en-US')}</p><strong>Top-paid employee</strong></div></div></section>}</main>
    {notice && <div className="toast">{notice}</div>}
    {modal && <div className="modal-backdrop" onMouseDown={() => setModal(null)}><form className="modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}><div className="modal-header"><div><h2>{modal === 'add' ? 'Add employee' : 'Edit employee'}</h2><p>Enter the employee's information below.</p></div><button type="button" id="close-modal-btn" className="icon-button" onClick={() => setModal(null)}><Icon name="close" /></button></div><div className="form-grid"><label>Full name<input id="emp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jamie Smith" /></label><label>Gmail / email address<input id="emp-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jamie@gmail.com" /></label><label>Department<select id="emp-department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{['Engineering', 'Design', 'Marketing', 'Operations', 'People', 'Sales', 'Finance'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Role<input id="emp-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Product Manager" /></label><label>Annual salary<input id="emp-salary" type="number" min="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="75000" /></label><label>Date of birth<input id="emp-dob" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></label><label>Date of hire<input id="emp-date-of-hire" type="date" value={form.date_of_hire} onChange={(e) => setForm({ ...form, date_of_hire: e.target.value })} /></label></div>{error && <p className="form-error">{error}</p>}<div className="modal-footer"><button type="button" id="cancel-employee-btn" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button id="submit-employee-btn" className="primary-button" type="submit">{modal === 'add' ? 'Add employee' : 'Save changes'}</button></div></form></div>}
  </div>
}

export default App
