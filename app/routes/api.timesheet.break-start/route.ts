import type { ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { verifyToken } from "~/lib/auth";

export const action: ActionFunction = async ({ request }) => {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token || !await verifyToken(token)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

    const { timesheet_id, break_start_time, break_pause_location, break_pause_device } = await request.json();
    
    const db = await getDB();
   
    await db.run(
    `UPDATE timesheets SET break_start_time = ?, break_pause_location = ?, break_pause_device = ? WHERE id = ?`,
    [break_start_time, break_pause_location, break_pause_device, timesheet_id]
    );
   
    const timesheet = await db.get(`SELECT * FROM timesheets WHERE id = ?`, [timesheet_id]);
   
    return new Response(JSON.stringify({ success: true, timesheet }), { status: 200, headers: { "Content-Type": "application/json" } });
};