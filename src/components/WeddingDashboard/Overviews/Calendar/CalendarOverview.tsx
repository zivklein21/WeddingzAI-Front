import { useEffect, useState } from "react";
import styles from "./CalendarOverview.module.css";
import { getEvents } from "../../../../services/calendar-service";
import { useAuth } from "../../../../hooks/useAuth/AuthContext";
import * as Icons from "../../../../icons/index";

type CalendarEvent = {
  _id: string;
  title: string;
  date: string; 
  color?: string;
};

type EventDay = {
  day: number;
  color?: string;
  title?: string;
};

export default function CalendarOverview() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!user?._id) return;

  setLoading(true);
  setError(null);

  getEvents(user._id)
    .then((res) => {
      setEvents(res.data);
    })
    .catch((err) => {
      console.error("[CalendarOverview.getEvents] Error:", err);
      setEvents([]);
      setError("Failed to load events.");
    })
    .finally(() => {
      setLoading(false);
    });
}, [user?._id]);

  if (loading) return <div className={styles.miniCalBox}><Icons.LoaderIcon className="spinner"/></div>;
  if (error) return <div className={styles.miniCalBox}><Icons.ErrorIcon className="errorIcon"/></div>;

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const daysWithEvents = events
    .map((ev) => {
      const d = new Date(ev.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        return {
          day: d.getDate(),
          color: ev.color || "#b291ff",
          title: ev.title,
        };
      }
      return null;
    })
    .filter(Boolean) as EventDay[];

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay(); // 0 = Sunday
  const weeks: (number | null)[][] = [];
  let current = 1 - startDay;
  while (current <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if (current > 0 && current <= daysInMonth) {
        week.push(current);
      } else {
        week.push(null);
      }
      current++;
    }
    weeks.push(week);
  }

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  function findEvent(day: number) {
    return daysWithEvents.find((ev) => ev.day === day);
  }

  return (
    <div className={styles.miniCalBox}>
      <div className={styles.weekdays}>
        {weekdays.map((wd, idx) => (
          <div key={`${wd}-${idx}`} className={styles.weekday}>
            {wd}
          </div>
        ))}
      </div>
      <div>
        {weeks.map((week, wi) => (
          <div className={styles.week} key={wi}>
            {week.map((day, di) =>
              day ? (
                <div className={styles.day} key={di}>
                  {day}
                  {findEvent(day) && (
                    <span
                      className={styles.eventDot}
                      style={{
                        background: findEvent(day)?.color ?? "#b291ff",
                      }}
                      title={findEvent(day)?.title ?? ""}
                    />
                  )}
                </div>
              ) : (
                <div key={di} className={styles.dayEmpty}></div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}