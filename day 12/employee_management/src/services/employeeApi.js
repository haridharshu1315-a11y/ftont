/**
 * Local employee data for the directory UI.
 * This keeps the app working offline and ensures the requested six-record view is always shown.
 */
const colors = ['purple', 'orange', 'blue', 'green', 'pink', 'yellow']

const fallbackEmployees = [
  { id: 'fallback-1', name: 'Alex Harris', email: 'alex@peoplehub.com', department: 'Engineering', role: 'Product Lead', salary: 120000, dob: '1990-04-12', date_of_hire: '2021-05-01' },
  { id: 'fallback-2', name: 'Daniel Brooks', email: 'daniel@peoplehub.com', department: 'Engineering', role: 'Frontend Engineer', salary: 102000, dob: '1991-07-09', date_of_hire: '2022-09-11' },
  { id: 'fallback-3', name: 'Jamie Smith', email: 'jamie@peoplehub.com', department: 'Design', role: 'UX Designer', salary: 95000, dob: '1993-08-21', date_of_hire: '2022-02-10' },
  { id: 'fallback-4', name: 'Nina Patel', email: 'nina@peoplehub.com', department: 'Design', role: 'Visual Designer', salary: 91000, dob: '1994-11-30', date_of_hire: '2023-06-01' },
  { id: 'fallback-5', name: 'Ravi Kumar', email: 'ravi@peoplehub.com', department: 'Operations', role: 'Operations Manager', salary: 110000, dob: '1988-12-05', date_of_hire: '2020-11-18' },
  { id: 'fallback-6', name: 'Maya Chen', email: 'maya@peoplehub.com', department: 'Operations', role: 'Operations Analyst', salary: 88000, dob: '1996-02-18', date_of_hire: '2023-08-14' },
  { id: 'fallback-7', name: 'Sophia Lee', email: 'sophia@peoplehub.com', department: 'Marketing', role: 'Marketing Manager', salary: 98000, dob: '1992-03-14', date_of_hire: '2021-11-08' },
  { id: 'fallback-8', name: 'Chris Moore', email: 'chris@peoplehub.com', department: 'Marketing', role: 'Content Strategist', salary: 86000, dob: '1989-10-24', date_of_hire: '2022-04-03' },
  { id: 'fallback-9', name: 'Priya Shah', email: 'priya@peoplehub.com', department: 'Sales', role: 'Sales Lead', salary: 105000, dob: '1990-09-05', date_of_hire: '2020-08-16' },
  { id: 'fallback-10', name: 'Liam Johnson', email: 'liam@peoplehub.com', department: 'Sales', role: 'Account Executive', salary: 87000, dob: '1995-01-27', date_of_hire: '2023-01-12' },
  { id: 'fallback-11', name: 'Ava Martinez', email: 'ava@peoplehub.com', department: 'Finance', role: 'Finance Analyst', salary: 94000, dob: '1991-12-18', date_of_hire: '2022-07-19' },
  { id: 'fallback-12', name: 'Noah Kim', email: 'noah@peoplehub.com', department: 'Finance', role: 'Controller', salary: 115000, dob: '1987-06-09', date_of_hire: '2019-03-22' },
  { id: 'fallback-13', name: 'Emma Wilson', email: 'emma@peoplehub.com', department: 'People', role: 'HR Business Partner', salary: 90000, dob: '1993-05-11', date_of_hire: '2021-02-15' },
  { id: 'fallback-14', name: 'Owen Davis', email: 'owen@peoplehub.com', department: 'People', role: 'Talent Specialist', salary: 82000, dob: '1994-08-10', date_of_hire: '2022-10-06' },
  { id: 'fallback-15', name: 'Grace Turner', email: 'grace@peoplehub.com', department: 'Engineering', role: 'Backend Engineer', salary: 108000, dob: '1992-11-02', date_of_hire: '2021-07-17' },
  { id: 'fallback-16', name: 'Ethan Rivera', email: 'ethan@peoplehub.com', department: 'Engineering', role: 'DevOps Engineer', salary: 112000, dob: '1988-02-20', date_of_hire: '2020-05-01' },
  { id: 'fallback-17', name: 'Mia Thompson', email: 'mia@peoplehub.com', department: 'Design', role: 'Product Designer', salary: 93000, dob: '1996-04-16', date_of_hire: '2023-03-09' },
  { id: 'fallback-18', name: 'Lucas Green', email: 'lucas@peoplehub.com', department: 'Operations', role: 'Project Coordinator', salary: 78000, dob: '1997-07-28', date_of_hire: '2023-10-13' },
  { id: 'fallback-19', name: 'Harper Lewis', email: 'harper@peoplehub.com', department: 'Marketing', role: 'SEO Specialist', salary: 84000, dob: '1995-09-03', date_of_hire: '2022-06-05' },
  { id: 'fallback-20', name: 'Benjamin Clark', email: 'benjamin@peoplehub.com', department: 'Sales', role: 'Business Development', salary: 89000, dob: '1989-12-31', date_of_hire: '2021-09-16' },
  { id: 'fallback-21', name: 'Chloe Adams', email: 'chloe@peoplehub.com', department: 'Finance', role: 'Payroll Specialist', salary: 76000, dob: '1993-02-14', date_of_hire: '2022-11-21' },
  { id: 'fallback-22', name: 'Henry Scott', email: 'henry@peoplehub.com', department: 'People', role: 'Recruiter', salary: 85000, dob: '1992-06-27', date_of_hire: '2023-04-24' },
  { id: 'fallback-23', name: 'Isabella Hall', email: 'isabella@peoplehub.com', department: 'Engineering', role: 'QA Engineer', salary: 97000, dob: '1994-10-08', date_of_hire: '2022-01-10' },
  { id: 'fallback-24', name: 'James Wright', email: 'james@peoplehub.com', department: 'Design', role: 'Motion Designer', salary: 92000, dob: '1991-08-01', date_of_hire: '2021-12-04' },
  { id: 'fallback-25', name: 'Amelia Wood', email: 'amelia@peoplehub.com', department: 'Operations', role: 'Business Analyst', salary: 86000, dob: '1990-01-19', date_of_hire: '2020-10-02' },
  { id: 'fallback-26', name: 'Elijah Baker', email: 'elijah@peoplehub.com', department: 'Marketing', role: 'Brand Manager', salary: 101000, dob: '1988-05-07', date_of_hire: '2019-07-29' },
  { id: 'fallback-27', name: 'Charlotte King', email: 'charlotte@peoplehub.com', department: 'Sales', role: 'Sales Manager', salary: 118000, dob: '1987-03-23', date_of_hire: '2018-11-11' },
  { id: 'fallback-28', name: 'Logan Perez', email: 'logan@peoplehub.com', department: 'Finance', role: 'Senior Finance Analyst', salary: 104000, dob: '1990-07-15', date_of_hire: '2020-01-03' },
  { id: 'fallback-29', name: 'Sofia Reed', email: 'sofia@peoplehub.com', department: 'People', role: 'People Operations Lead', salary: 111000, dob: '1989-11-29', date_of_hire: '2019-05-18' },
  { id: 'fallback-30', name: 'Jack Murphy', email: 'jack@peoplehub.com', department: 'Engineering', role: 'Solutions Architect', salary: 128000, dob: '1986-09-12', date_of_hire: '2018-08-30' },
  { id: 'fallback-31', name: 'Abigail Price', email: 'abigail@peoplehub.com', department: 'Design', role: 'Researcher', salary: 90000, dob: '1995-12-26', date_of_hire: '2022-05-14' },
  { id: 'fallback-32', name: 'Matthew Foster', email: 'matthew@peoplehub.com', department: 'Operations', role: 'Logistics Manager', salary: 96000, dob: '1988-04-04', date_of_hire: '2021-06-07' },
  { id: 'fallback-33', name: 'Ella Diaz', email: 'ella@peoplehub.com', department: 'Marketing', role: 'Email Marketing Lead', salary: 89000, dob: '1994-02-01', date_of_hire: '2022-08-25' },
  { id: 'fallback-34', name: 'David Russell', email: 'david@peoplehub.com', department: 'Sales', role: 'Regional Director', salary: 123000, dob: '1985-10-17', date_of_hire: '2017-12-09' },
  { id: 'fallback-35', name: 'Lily Perry', email: 'lily@peoplehub.com', department: 'Finance', role: 'Treasury Analyst', salary: 95000, dob: '1992-01-22', date_of_hire: '2021-03-11' },
  { id: 'fallback-36', name: 'Samuel Long', email: 'samuel@peoplehub.com', department: 'People', role: 'HR Generalist', salary: 84000, dob: '1996-06-14', date_of_hire: '2023-07-02' },
  { id: 'fallback-37', name: 'Victoria Cooper', email: 'victoria@peoplehub.com', department: 'Engineering', role: 'Mobile Engineer', salary: 110000, dob: '1991-05-13', date_of_hire: '2021-10-09' },
  { id: 'fallback-38', name: 'Sebastian Barnes', email: 'sebastian@peoplehub.com', department: 'Design', role: 'Illustrator', salary: 88000, dob: '1993-09-20', date_of_hire: '2022-12-18' },
  { id: 'fallback-39', name: 'Zoe Rivera', email: 'zoe@peoplehub.com', department: 'Operations', role: 'Operations Specialist', salary: 83000, dob: '1997-03-29', date_of_hire: '2023-11-27' },
  { id: 'fallback-40', name: 'Nathan Morris', email: 'nathan@peoplehub.com', department: 'Marketing', role: 'Social Media Lead', salary: 92000, dob: '1990-12-11', date_of_hire: '2021-04-06' },
  { id: 'fallback-41', name: 'Hannah Bell', email: 'hannah@peoplehub.com', department: 'Sales', role: 'Customer Success Lead', salary: 98000, dob: '1992-08-08', date_of_hire: '2020-09-19' },
  { id: 'fallback-42', name: 'Andrew Ward', email: 'andrew@peoplehub.com', department: 'Finance', role: 'Financial Planner', salary: 102000, dob: '1987-07-25', date_of_hire: '2019-11-14' },
  { id: 'fallback-43', name: 'Penelope Ross', email: 'penelope@peoplehub.com', department: 'People', role: 'Compensation Specialist', salary: 94000, dob: '1994-11-07', date_of_hire: '2022-02-28' },
  { id: 'fallback-44', name: 'Jonathan Hughes', email: 'jonathan@peoplehub.com', department: 'Engineering', role: 'Data Engineer', salary: 114000, dob: '1989-03-18', date_of_hire: '2020-06-24' },
  { id: 'fallback-45', name: 'Layla Flores', email: 'layla@peoplehub.com', department: 'Design', role: 'Service Designer', salary: 91000, dob: '1995-07-23', date_of_hire: '2023-01-08' },
  { id: 'fallback-46', name: 'Gabriel Cox', email: 'gabriel@peoplehub.com', department: 'Operations', role: 'Process Manager', salary: 99000, dob: '1988-12-14', date_of_hire: '2021-05-20' },
  { id: 'fallback-47', name: 'Avery Torres', email: 'avery@peoplehub.com', department: 'Marketing', role: 'Growth Analyst', salary: 87000, dob: '1996-10-05', date_of_hire: '2023-09-15' },
  { id: 'fallback-48', name: 'Joshua Reed', email: 'joshua@peoplehub.com', department: 'Sales', role: 'Enterprise Account Manager', salary: 106000, dob: '1989-04-12', date_of_hire: '2020-02-17' },
  { id: 'fallback-49', name: 'Madison Brooks', email: 'madison@peoplehub.com', department: 'Finance', role: 'Budget Analyst', salary: 88000, dob: '1993-06-30', date_of_hire: '2022-03-05' },
  { id: 'fallback-50', name: 'Caleb Bennett', email: 'caleb@peoplehub.com', department: 'People', role: 'HR Manager', salary: 100000, dob: '1987-01-16', date_of_hire: '2018-06-12' },
]

const initialsFor = (name = '') => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '??'

/** Normalize MockAPI data so the UI always receives the required fields. */
export const normalizeEmployee = (employee, index = 0) => ({
  ...employee,
  id: String(employee.id),
  name: employee.name || '',
  email: employee.email || '',
  department: employee.department || 'Unassigned',
  role: employee.role || '',
  salary: Number(employee.salary) || 0,
  dob: employee.dob || employee.date_of_birth || '',
  date_of_hire: employee.date_of_hire || employee.dateOfHire || '',
  initials: initialsFor(employee.name),
  color: colors[index % colors.length],
})

let employeeStore = fallbackEmployees.map((employee, index) => normalizeEmployee(employee, index))

export async function getEmployees() {
  return employeeStore.map((employee) => ({ ...employee }))
}

export async function createEmployee(employee) {
  const created = normalizeEmployee({ ...employee, id: Date.now().toString() })
  employeeStore = [...employeeStore, created]
  return created
}

export async function updateEmployee(id, employee) {
  const updated = normalizeEmployee({ ...employee, id })
  employeeStore = employeeStore.map((item) => (item.id === id ? updated : item))
  return updated
}

export async function deleteEmployee(id) {
  employeeStore = employeeStore.filter((item) => item.id !== id)
}
