import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import { getWeekDays, isSameDay } from "~/lib/timesheet";
import { TimesheetRow } from "~/ui/TimesheetTimeline";
import "../../style/timesheet.css";
import CalendarView from "~/ui/CalendarView";
import Navbar from "~/components/Navbar";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, first_name, last_name FROM employees ORDER BY first_name");
  const timesheets = await db.all("SELECT * FROM timesheets");
  return { employees, timesheets };
}

export default function TimesheetsPage() {
  const { employees, timesheets } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<"list" | "calendar">("list");

  const selectedId = searchParams.get("employee") ? Number(searchParams.get("employee")) : employees[0]?.id;
  const weekDays = getWeekDays(weekOffset);
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "2-digit" });

  const employeeTimesheets = timesheets.filter((t: any) => t.employee_id === selectedId);

  return (
    <>
      <Navbar />
    <div className="timesheet_wrap">
      <div className="timesheet_header">
        <select
          title="Select Employee"
          className="timesheet_employee_select"
          value={selectedId}
          onChange={e => setSearchParams({ employee: e.target.value })}>
          {employees.map((emp: any) => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className={`timesheet_view_btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
          <button className={`timesheet_view_btn ${view === "calendar" ? "active" : ""}`} onClick={() => setView("calendar")}>Calendar</button>
        </div>
      </div>

      {view === "list" && (
        <>
          <div className="timesheet_week_nav">
            <button className="timesheet_nav_btn" onClick={() => setWeekOffset(w => w - 1)}>Prev</button>
            <span className="timesheet_week_label">{fmt.format(weekDays[0])} – {fmt.format(weekDays[6])}</span>
            <button className="timesheet_nav_btn" onClick={() => setWeekOffset(w => w + 1)}>Next</button>
          </div>

          <table className="timesheet_table">
            <thead>
              <tr>
                <th className="timesheet_th" style={{ width: 130 }}>Date</th>
                <th className="timesheet_th" style={{ width: 140 }}>Status</th>
                <th className="timesheet_th">Timeline (8am – 7pm)</th>
                <th className="timesheet_th timesheet_th--right" style={{ width: 90 }}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {weekDays.map(day => {
                const ts = employeeTimesheets.find((t: any) => isSameDay(new Date(t.start_time), day)) ?? null;
                return <TimesheetRow key={day.toISOString()} timesheet={ts} date={day} />;
              })}
            </tbody>
          </table>

          <div className="timesheet_legend">
            {[["#B5D4F4", "Work"], ["#FAC775", "Break"]].map(([bg, label]) => (
              <span key={label} className="timesheet_legend_item">
                <span className="timesheet_legend_dot" style={{ background: bg }} />
                {label}
              </span>
            ))}
          </div>
        </>
      )}

      {view === "calendar" && (
        <CalendarView />
      )}

      <ul>
        <li><a href="/">My attendance</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
    </>
  );
}