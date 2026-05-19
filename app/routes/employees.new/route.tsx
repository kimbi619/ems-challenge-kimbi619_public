import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";


export default function NewEmployeePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("auth_token") ?? "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/employee/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      navigate("/employees");
    } else {
      setError(data.error || "Failed to create employee");
    }
  };

  const form = new FormData()

  const handleFormInput = (key:string, value:any) => {
    console.log(typeof(value))
    form.set(key, value)
  }

  return (
    <div>
      <Navbar />
      <div className="employee_table_header">
        <div>
          <h1>New Employee</h1>
          <p>Fill in the details to create a new employee record</p>
        </div>
      </div>
      <div className="employee_form">
      <form onSubmit={handleSubmit}>
        <div className="row_wrap">
        <div>
          <label htmlFor="first_name">First Name</label>
          <input type="text" name="first_name" id="first_name" required />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input type="text" name="last_name" id="last_name" required />
        </div>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input type="tel" name="phone" id="phone" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        <div>
          <label htmlFor="hire_date">Hire Date</label>
          <input type="date" name="hire_date" id="hire_date" required />
        </div>
        <div className="row_wrap">
        <div>
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" required />
        </div>
        <div>
          <label htmlFor="job_title">Job Position</label>
          <input type="text" name="job_title" id="job_title" required />
        </div>
        </div>
        
        <div>
          <label htmlFor="manager_id">Manager ID</label>
          <input type="number" name="manager_id" id="manager_id" />
        </div>

        <div className="row_wrap">
          <div>
            <label htmlFor="initial_salary">Initial Salary</label>
            <input type="number" name="initial_salary" id="initial_salary" required min={200000} />
          </div>
          <div>
            <label htmlFor="salary">Salary</label>
            <input type="number" name="salary" id="salary" required min={200000}/>
          </div>
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" id="role" required>
            <option value="engineering">Engineering</option>
            <option value="admin">Admin</option>
            <option value="marketing">Marketing</option>
            <option value="finance">Finance</option>
            <option value="hr">HR</option>
          </select>
        </div>
        <div>
          <label htmlFor="identification_number">ID Card Number</label>
          <input name="identification_number" id="identification_number" />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" required min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split("T")[0]} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]} />
        </div>
        <div>
          <label htmlFor="avatar">Avatar</label>
          <input type="file" name="avatar" id="avatar" accept="image/*" />
        </div>
        <div>
          <label htmlFor="cv">Curiculum Vitae</label>
          <input type="file" name="cv" id="cv" accept=".pdf,.doc,.docx" />
        </div>
        <div>
          <label htmlFor="employment_certificate">Employment Certificate</label>
          <input type="file" name="employment_certificate" id="employment_certificate" accept=".pdf,.doc,.docx" />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
      </div>
    </div>
  );
}