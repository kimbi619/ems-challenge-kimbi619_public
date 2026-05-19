import { Link, useLoaderData, useNavigate, type LoaderFunctionArgs } from "react-router"
import Navbar from "~/components/Navbar"
import { getDB } from "~/db/getDB"
import { requireAuth } from "~/lib/auth"

export async function loader({ request }: LoaderFunctionArgs) {
  requireAuth(request)
  const url = new URL(request.url)
  const search = url.searchParams.get("search")?.trim() ?? ""
  const department = url.searchParams.get("department")?.trim() ?? ""


  const db = await getDB()
  const employees = await db.all(`
    SELECT 
      e.*,
      m.first_name AS manager_first_name,
      m.last_name AS manager_last_name,
      m.email AS manager_email
    FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE
      (
        e.first_name  LIKE $search OR
        e.last_name   LIKE $search OR
        e.email       LIKE $search
      )
      AND ($department = '' OR e.department = $department)
  `, { $search: `%${search}%`, $department: department })

  return { employees, search, department }
}

export default function EmployeesPage() {
  const { employees, search, department } = useLoaderData() as Awaited<ReturnType<typeof loader>>

  function update(patch: Record<string, string>) {
    const params = new URLSearchParams({ search, department, ...patch })
    for (const [k, v] of [...params]) if (!v) params.delete(k)
    navigate(`?${params}`, { replace: true })
  }
  const navigate = useNavigate()

  const gotoEmployee =(em_id: number) => {
    navigate(`/employees/${em_id}`)
  }
  return (
    <>
      <Navbar />
    <div className="employee_table">
      <div className="employee_table_header">
        <div>
          <h1>Employees</h1>
          <p>Manage your employees efficiently</p>
        </div>
          <Link to="/employees/new" className="btn">New Employee</Link>
      </div>
      <div className="employee_toolbar">
        <input type="text" placeholder="Search employees..." className="employee_search" onChange={e => update({ search: e.currentTarget.value })} defaultValue={search} />
        <select className="employee_filter" title="Filter by department" onChange={e => update({ department: e.currentTarget.value })} value={department}>
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>avatar</th>
            <th>Name</th>
            <th>email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Job</th>
            <th>Manager</th>
            <th>Hire Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: any) => (
            <tr onClick={() => gotoEmployee(employee.id)}>
                <td><div className="list_avatar_image_wrapper"><img className="list_avatar_image" src={employee.avatar_url} alt={employee.first_name} /></div></td>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.department}</td>
                <td>{employee.job_title}</td>
                <td>
                  <div>{employee.manager_first_name ? `${employee.manager_first_name} ${employee.manager_last_name}` : "—"}</div>
                  <div>{employee.manager_email && employee.manager_email}</div>
                </td>
                <td>{new Date(employee.hire_date).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
    </>
  )
}
