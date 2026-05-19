import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Navbar from "~/components/Navbar";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string | null;
};

type Timesheet = {
  id: number;
  start_time: string;
  end_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  is_absence: boolean;
  check_in_location: string;
  check_out_location: string | null;
  is_remote: boolean;
};

function getDevice(): string {
  return navigator.userAgent.toString();
}

async function getLocation(): Promise<string> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve("Location unavailable");
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`),
      () => resolve("Location unavailable"),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function HomePage() {
  const { timesheet: initial } = useLoaderData() as { timesheet: Timesheet | null };
  const [timesheet, setTimesheet] = useState<Timesheet | null>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const token = Cookies.get("auth_token") ?? "";
  const user: User | null = (() => {
    try {
      const raw = Cookies.get("user_data");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  useEffect(() => {
    if (!timesheet || timesheet.end_time) return;

    function calcElapsed() {
      if (!timesheet) return 0;
      const now = Date.now();
      const start = new Date(timesheet.start_time).getTime();
      let total = Math.floor((now - start) / 1000);

      if (timesheet.break_start_time && !timesheet.break_end_time) {
        const breakStart = new Date(timesheet.break_start_time).getTime();
        total -= Math.floor((now - breakStart) / 1000);
      }
      if (timesheet.break_start_time && timesheet.break_end_time) {
        const breakDur = Math.floor(
          (new Date(timesheet.break_end_time).getTime() - new Date(timesheet.break_start_time).getTime()) / 1000
        );
        total -= breakDur;
      }
      return Math.max(0, total);
    }

    setElapsed(calcElapsed());
    const interval = setInterval(() => setElapsed(calcElapsed()), 1000);
    return () => clearInterval(interval);
  }, [timesheet]);

  const isCheckedIn    = !!timesheet && !timesheet.end_time;
  const isOnBreak      = isCheckedIn && !!timesheet?.break_start_time && !timesheet?.break_end_time;
  const isCheckedOut   = !!timesheet?.end_time;
  const canCheckIn     = !timesheet;
  const canBreak       = isCheckedIn && !isOnBreak;
  const canResumeBreak = isOnBreak;
  const canCheckOut    = isCheckedIn && !isOnBreak;

  async function post(endpoint: string, body: object) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn() {
    const [location, device] = await Promise.all([getLocation(), Promise.resolve(getDevice())]);
    const data = await post("/api/timesheet/checkin", {
      employee_id: user!.id,
      start_time: new Date().toISOString(),
      check_in_location: location,
      check_in_device: device,
      is_remote: false,
    });
    if (data) setTimesheet(data.timesheet);
  }

  async function handleBreakStart() {
    const [location, device] = await Promise.all([getLocation(), Promise.resolve(getDevice())]);
    const data = await post("/api/timesheet/break-start", {
      timesheet_id: timesheet!.id,
      break_start_time: new Date().toISOString(),
      break_pause_location: location,
      break_pause_device: device,
    });
    if (data) setTimesheet(data.timesheet);
  }

  async function handleBreakEnd() {
    const [location, device] = await Promise.all([getLocation(), Promise.resolve(getDevice())]);
    const data = await post("/api/timesheet/break-end", {
      timesheet_id: timesheet!.id,
      break_end_time: new Date().toISOString(),
      break_resume_location: location,
      break_resume_device: device,
    });
    if (data) setTimesheet(data.timesheet);
  }

  async function handleCheckOut() {
    const [location, device] = await Promise.all([getLocation(), Promise.resolve(getDevice())]);
    const data = await post("/api/timesheet/checkout", {
      timesheet_id: timesheet!.id,
      end_time: new Date().toISOString(),
      check_out_location: location,
      check_out_device: device,
    });
    if (data) setTimesheet(data.timesheet);
  }

  return (
    <>
      <Navbar />
    <div className="home_wrap">
      <div className="home_greeting">
        <p className="home_name">Welcome back, {user?.first_name}</p>
        <p className="home_date">{new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      <div className={`home_timer ${isOnBreak ? "home_timer--break" : isCheckedOut ? "home_timer--done" : ""}`}>
        {isCheckedOut
          ? formatTime(timesheet!.end_time!)
          : formatDuration(elapsed)}
        <span className="home_timer_label">
          {isCheckedOut ? "checked out" : isOnBreak ? "on break" : isCheckedIn ? "working" : "not checked in"}
        </span>
      </div>

      {timesheet && (
        <div className="home_summary">
          {timesheet.start_time && (
            <div className="home_summary_row">
              <span>Check-in</span>
              <span>{formatTime(timesheet.start_time)}</span>
            </div>
          )}
          {timesheet.break_start_time && (
            <div className="home_summary_row">
              <span>Break start</span>
              <span>{formatTime(timesheet.break_start_time)}</span>
            </div>
          )}
          {timesheet.break_end_time && (
            <div className="home_summary_row">
              <span>Break end</span>
              <span>{formatTime(timesheet.break_end_time)}</span>
            </div>
          )}
          {timesheet.end_time && (
            <div className="home_summary_row">
              <span>Check-out</span>
              <span>{formatTime(timesheet.end_time)}</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="home_error">{error}</p>}

      <div className="home_actions">
        {canCheckIn && (
          <button className="home_btn home_btn--checkin" onClick={handleCheckIn} disabled={loading}>
            {loading ? "..." : "Check In"}
          </button>
        )}
        {canBreak && (
          <button className="home_btn home_btn--break" onClick={handleBreakStart} disabled={loading}>
            {loading ? "..." : "Start Break"}
          </button>
        )}
        {canResumeBreak && (
          <button className="home_btn home_btn--resume" onClick={handleBreakEnd} disabled={loading}>
            {loading ? "..." : "Resume Work"}
          </button>
        )}
        {canCheckOut && (
          <button className="home_btn home_btn--checkout" onClick={handleCheckOut} disabled={loading}>
            {loading ? "..." : "Check Out"}
          </button>
        )}
        {isCheckedOut && (
          <p className="home_done">See you tomorrow!</p>
        )}
      </div>

      <br/>
      
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
      <br/>
      <br/>
      <button className="logout_btn" onClick={() => {
        Cookies.remove("auth_token");
        Cookies.remove("user_data");
        window.location.href = "/auth/login";
      }}>
        Logout
      </button>
    </div>
    </>
  );
}