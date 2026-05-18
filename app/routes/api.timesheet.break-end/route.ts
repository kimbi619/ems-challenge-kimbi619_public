import type { ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const { timesheet_id, break_end_time, break_resume_location, break_resume_device } = await request.json();
  const db = await getDB();
  const ts = await db.get(`SELECT break_start_time FROM timesheets WHERE id = ?`, [timesheet_id]);
  const break_duration = Math.round((new Date(break_end_time).getTime() - new Date(ts.break_start_time).getTime()) / 60000);
  await db.run(
    `UPDATE timesheets SET break_end_time = ?, break_duration = ?, break_resume_location = ?, break_resume_device = ? WHERE id = ?`,
    [break_end_time, break_duration, break_resume_location, break_resume_device, timesheet_id]
  );
  const timesheet = await db.get(`SELECT * FROM timesheets WHERE id = ?`, [timesheet_id]);
  return new Response(JSON.stringify({ success: true, timesheet }), { status: 200, headers: { "Content-Type": "application/json" } });
};