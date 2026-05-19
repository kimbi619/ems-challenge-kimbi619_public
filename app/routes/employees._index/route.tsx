import { Link, useLoaderData, useNavigate, type LoaderFunctionArgs } from "react-router"
import Navbar from "~/components/Navbar"
import { getDB } from "~/db/getDB"
import { requireAuth } from "~/lib/auth"

export async function loader({ request }: LoaderFunctionArgs) {
  requireAuth(request)
  const db = await getDB()
  const employees = await db.all(`
    SELECT 
      e.*,
      m.first_name AS manager_first_name,
      m.last_name AS manager_last_name,
      m.email AS manager_email
    FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.id
  `)

  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
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
