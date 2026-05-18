import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader({ params }: LoaderFunctionArgs) {
  const db = await getDB()
  const employee = await db.get(`
    SELECT 
      e.*,
      m.first_name AS manager_first_name,
      m.last_name AS manager_last_name,
      r.name AS role_name
    FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.id
    LEFT JOIN roles r ON e.role_id = r.id
    WHERE e.id = ?
  `, [params.employeeId])

  if (!employee) {
    throw new Response("Employee not found", { status: 404 })
  }

  return { employee }
}

export default function EmployeePage() {
  const { employee } = useLoaderData()

  return (
    <div>
      <div className="employee_details">
        <div className="user_profile">
          <div className="user_pp">
            <img src={employee.avatar_url} alt={`${employee.first_name} ${employee.last_name}`} />
          </div>
          <div className="basic_user_info">
            <p>{employee.first_name} {employee.last_name}</p>
            <p>{employee.email}</p>
            <p>{employee.phone}</p>
            <p>{employee.job_title}</p>
          </div>
        </div>
        <div className="basic_user_info">
          <p>Department: {employee.department}</p>
          <p>Access Level: {employee.role_name ?? "—"}</p>
          <p>Hire Date: {new Date(employee.hire_date).toDateString()}</p>
          <p>Manager: {employee.manager_first_name ? `${employee.manager_first_name} ${employee.manager_last_name}` : "—"}</p>
          <p>Current Comp: XAF {employee.current_salary?.toLocaleString()}</p>
          <p>Status: {employee.status}</p>
        </div>
      </div>

      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
  )
}