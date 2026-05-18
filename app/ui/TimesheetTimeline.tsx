import { useState } from "react";
import { pct, toMins, formatTime, formatDateTime, formatH, EXPECTED_IN } from "~/lib/timesheet";

export type Timesheet = {
  id: number;
  start_time: string;
  end_time: string;
  break_duration: number;
  break_start_time: string;
  break_end_time: string;
  check_in_location: string;
  check_out_location: string;
  check_in_device: string;
  check_out_device: string;
  break_pause_location: string;
  break_resume_location: string;
  break_pause_device: string;
  break_resume_device: string;
  is_remote: boolean;
  is_regularized: boolean;
  regularization_reason: string | null;
  regularization_requested_at: string | null;
  regularization_request_approved_at: string | null;
  is_absence: boolean;
  absence_reason: string | null;
};

type Props = {
  timesheet: Timesheet | null; 
  date: Date;
};

export function TimesheetRow({ timesheet, date }: Props) {
  const [open, setOpen] = useState(false);
  const dateStr = date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const isAbsent = !timesheet || timesheet.is_absence;

  if (isAbsent) {
    return (
      <tr>
        <td className="timesheet_td">{dateStr}</td>
        <td className="timesheet_td"><span className="timesheet_badge timesheet_badge--absent">Absent</span></td>
        <td className="timesheet_td"><div className="timesheet_tl_absent">No data</div></td>
        <td className="timesheet_td timesheet_td--right">—</td>
      </tr>
    );
  }

  const inM  = toMins(timesheet.start_time);
  const outM = toMins(timesheet.end_time);
  const bsM  = toMins(timesheet.break_start_time);
  const beM  = toMins(timesheet.break_end_time);
  const breakDur   = beM - bsM;
  const workedMins = outM - inM - breakDur;
  const lateIn     = inM > EXPECTED_IN + 5;
  const earlyOut   = outM < (17 * 60) - 5;

  const badge = lateIn ? { label: "Late",      cls: "timesheet_badge--late"    }
              : earlyOut ? { label: "Early out",  cls: "timesheet_badge--early"   }
              : { label: "On time",   cls: "timesheet_badge--ontime"  };

  return (
    <>
      <tr onClick={() => setOpen(true)} 
        onMouseEnter={e => (e.currentTarget.style.background = "var(--color-background-secondary)")}
        onMouseLeave={e => (e.currentTarget.style.background = "")}>
        <td className="timesheet_td">{dateStr}</td>
        <td className="timesheet_td">
          <span className={`timesheet_badge ${badge.cls}`}>{badge.label}</span>
          {timesheet.is_remote ? <span className="timesheet_badge timesheet_badge--remote">Remote</span> : <></>}
          {timesheet.is_regularized && <span className="timesheet_badge timesheet_badge--regularized">Regularized</span>}
        </td>
        <td className="timesheet_td">
          <div className="timesheet_timeline_wrap">
            <div className="timesheet_tl_bar timesheet_tl_bar--work" style={{ left: `${pct(inM)}%`, width: `${pct(outM) - pct(inM)}%` }} />
            <div className="timesheet_tl_bar timesheet_tl_bar--break" style={{ left: `${pct(bsM)}%`, width: `${pct(beM) - pct(bsM)}%` }} />
            <span className="timesheet_tl_label timesheet_tl_label--start" style={{ left: `${pct(inM)}%` }}> {formatTime(timesheet.start_time)}</span>
            <span className="timesheet_tl_label timesheet_tl_label--end" style={{ left: `${pct(outM)}%` }}>{formatTime(timesheet.end_time)}</span>
          </div>
        </td>
        <td className="timesheet_td timesheet_td--right">
          <div className="timesheet_hours_main">{formatH(workedMins)}</div>
          {breakDur > 0 && <div className="timesheet_hours_sub">break {formatH(breakDur)}</div>}
        </td>
      </tr>

      {open && (
        <TimesheetModal timesheet={timesheet} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function ModalRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="timesheet_modal_row">
      <span className="timesheet_modal_label">{label}</span>
      <span className="timesheet_modal_value">{value}</span>
    </div>
  );
}

function TimesheetModal({ timesheet, onClose }: { timesheet: Timesheet; onClose: () => void }) {
  return (
    <tr>
      <td colSpan={4} >
        <div className="timesheet_modal_overlay" onClick={onClose}>
          <div className="timesheet_modal" onClick={e => e.stopPropagation()}>
            <div className="timesheet_modal_header">
              <span className="timesheet_modal_title">Timesheet details</span>
              <button className="timesheet_modal_close" onClick={onClose}>✕</button>
            </div>

            <div className="timesheet_modal_section">
              <div className="timesheet_modal_section_title">Check-in</div>
              <ModalRow label="Time" value={formatDateTime(timesheet.start_time)} />
              <ModalRow label="Location" value={timesheet.check_in_location} />
              <ModalRow label="Device" value={timesheet.check_in_device} />
            </div>

            <div className="timesheet_modal_section">
              <div className="timesheet_modal_section_title">Break</div>
              <ModalRow label="Start" value={formatDateTime(timesheet.break_start_time)} />
              <ModalRow label="End" value={formatDateTime(timesheet.break_end_time)} />
              <ModalRow label="Duration" value={`${timesheet.break_duration} min`} />
              <ModalRow label="Pause location" value={timesheet.break_pause_location} />
              <ModalRow label="Resume location" value={timesheet.break_resume_location} />
              <ModalRow label="Pause device" value={timesheet.break_pause_device} />
              <ModalRow label="Resume device" value={timesheet.break_resume_device} />
            </div>

            <div className="timesheet_modal_section">
              <div className="timesheet_modal_section_title">Check-out</div>
              <ModalRow label="Time" value={formatDateTime(timesheet.end_time)} />
              <ModalRow label="Location" value={timesheet.check_out_location} />
              <ModalRow label="Device" value={timesheet.check_out_device} />
            </div>

            {timesheet.is_regularized && (
              <div className="timesheet_modal_section">
                <div className="timesheet_modal_section_title">Regularization</div>
                <ModalRow label="Reason" value={timesheet.regularization_reason} />
                <ModalRow label="Requested at" value={timesheet.regularization_requested_at ? formatDateTime(timesheet.regularization_requested_at) : null} />
                <ModalRow label="Approved at" value={timesheet.regularization_request_approved_at ? formatDateTime(timesheet.regularization_request_approved_at) : null} />
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}