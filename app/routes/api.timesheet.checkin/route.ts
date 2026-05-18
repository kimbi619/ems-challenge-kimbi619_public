import type { ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { verifyToken } from "~/lib/auth";

export const action: ActionFunction = async ({ request }) => {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token || !await verifyToken(token))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const { employee_id, start_time, check_in_location, check_in_device, is_remote } = await request.json();

  const db = await getDB();

  const today = new Date().toISOString().split("T")[0];
  const existing = await db.get(
    `SELECT id FROM timesheets WHERE employee_id = ? AND DATE(start_time) = ?`,
    [employee_id, today]
  );
  if (existing)
    return new Response(JSON.stringify({ error: "Already checked in today" }), { status: 409, headers: { "Content-Type": "application/json" } });

  const result = await db.run(
    `INSERT INTO timesheets (
      employee_id, start_time, break_duration,
      break_start_time, break_end_time,
      check_in_location, check_out_location,
      check_in_device, check_out_device,
      break_pause_location, break_resume_location,
      break_pause_device, break_resume_device,
      is_remote, is_regularized, is_absence
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employee_id, start_time, 
      0, null, null,
      check_in_location, "",
      check_in_device, "",
      "", "", "", "",
      is_remote ? 1 : 0, 0, 0
    ]
  );

  const timesheet = await db.get(`SELECT * FROM timesheets WHERE id = ?`, [result.lastID]);
  return new Response(JSON.stringify({ success: true, timesheet }), { status: 201, headers: { "Content-Type": "application/json" } });
};