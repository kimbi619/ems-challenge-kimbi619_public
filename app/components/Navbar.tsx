import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <div id="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        Home
      </NavLink>
      <NavLink to="/timesheets" className={({ isActive }) => isActive ? "active" : ""}>
        Timesheets
      </NavLink>
      <NavLink to="/employees" className={({ isActive }) => isActive ? "active" : ""}>
        Employees
      </NavLink>
    </div>
  )
}

export default Navbar