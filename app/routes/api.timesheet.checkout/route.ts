import type { ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const { timesheet_id, end_time, check_out_location, check_out_device } = await request.json();
  const db = await getDB();

  const ts = await db.get(`SELECT start_time FROM timesheets WHERE id = ?`, [timesheet_id]);
  if (new Date(end_time).getTime() < new Date(ts.start_time).getTime()) {
    return new Response(JSON.stringify({ error: "End time cannot be before start time" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  await db.run(
    `UPDATE timesheets SET end_time = ?, check_out_location = ?, check_out_device = ? WHERE id = ?`,
    [end_time, check_out_location, check_out_device, timesheet_id]
  );
  const timesheet = await db.get(`SELECT * FROM timesheets WHERE id = ?`, [timesheet_id]);
  return new Response(JSON.stringify({ success: true, timesheet }), { status: 200, headers: { "Content-Type": "application/json" } });
};