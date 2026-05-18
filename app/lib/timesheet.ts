export const EXPECTED_IN  = 9  * 60;
export const EXPECTED_OUT = 17 * 60;
export const TL_START     = 8  * 60;
export const TL_END       = 19 * 60;
export const TL_RANGE     = TL_END - TL_START;

export function toMins(timeStr: string) {
  const d = new Date(timeStr);
  return d.getHours() * 60 + d.getMinutes();
}

export function pct(mins: number) {
  return Math.max(0, Math.min(100, ((mins - TL_START) / TL_RANGE) * 100));
}

export function formatH(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatTime(timeStr: string) {
  return new Date(timeStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(timeStr: string) {
  return new Date(timeStr).toLocaleString([], {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function getWeekDays(offset: number): Date[] {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}