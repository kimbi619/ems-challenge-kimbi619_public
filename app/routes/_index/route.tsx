import { redirect, type LoaderFunctionArgs } from "react-router"
import HomePage from "./home";
import { getDB } from "~/db/getDB";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie_header = request.headers.get("Cookie") ?? "";
  const token = cookie_header.split(";").map(c => c.trim()).find(c => c.startsWith("auth_token="));

  if (!token) throw redirect("/auth/login");
  
  const userRaw = cookie_header.split(";").map(c => c.trim()).find(c => c.startsWith("user_data="))?.split("=").slice(1).join("=");
  if (!userRaw) throw redirect("/auth/login");

  const user = JSON.parse(decodeURIComponent(userRaw));

  const db = await getDB();
  const today = new Date().toISOString().split("T")[0];
  const timesheet = await db.get(
    `SELECT * FROM timesheets WHERE employee_id = ? AND DATE(start_time) = ?`,
    [user.id, today]
  );

  return { timesheet: timesheet ?? null };
}

export { HomePage as default };