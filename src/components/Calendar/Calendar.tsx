import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./fc.css";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/calendar-service";
import * as Icons from "../../icons/index";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import styles from "./Calendar.module.css";
import EventModal from "./EventModal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from './DeleteModal';

type CalendarEvent = {
  _id: string;
  title: string;
  date: string;
  color?: string;
};

const WEDDING_EVENT_TITLE = "My Wedding 🌸";
const WEDDING_EVENT_COLOR = "#ff69b4";

export default function CalendarPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const USER_ID = user?._id;
  const weddingDate = user?.weddingDate;
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (!USER_ID || !weddingDate) return;
    const { request } = getEvents(USER_ID);
    request
      .then((res) => {
        const events = res.data as CalendarEvent[];
        const hasWedding = events.some(
          (ev) => ev.date.startsWith(weddingDate) && ev.title === WEDDING_EVENT_TITLE
        );
        if (!hasWedding) {
          createEvent(USER_ID, {
            title: WEDDING_EVENT_TITLE,
            date: weddingDate,
            color: WEDDING_EVENT_COLOR,
          }).request.then((addRes) => {
            setEvents([...events, addRes.data as CalendarEvent]);
          });
        } else {
          setEvents(events);
        }
      })
      .catch((err) => alert(err.message));
  }, [USER_ID, weddingDate]);

  const handleDateClick = (arg: { dateStr: string }) => {
    setModalDate(arg.dateStr);
    setEditingEvent(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEventClick = (arg: { event: any }) => {
    const eventObj = events.find((e) => e._id === arg.event.id);
    if (!eventObj) return;
    setEditingEvent(eventObj);
    setModalDate(eventObj.date);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleSaveEvent = async ({
    title,
    color,
  }: {
    title: string;
    color: string;
  }) => {
    setModalOpen(false);
    if (!USER_ID || !modalDate) return;

    if (modalMode === "create") {
      try {
        const { request } = createEvent(USER_ID, { title, color, date: modalDate });
        const res = await request;
        setEvents((prev) => [...prev, res.data as CalendarEvent]);
      } catch (err: any) {
        alert(err.message);
      }
    } else if (modalMode === "edit" && editingEvent) {
      try {
        const { request } = updateEvent(USER_ID, editingEvent._id, { title, color });
        const res = await request;
        setEvents((prev) =>
          prev.map((e) =>
            e._id === editingEvent._id ? (res.data as CalendarEvent) : e
          )
        );
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleDeleteEvent = () => {
    setModalOpen(false);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
  setConfirmDeleteOpen(false);
  setModalOpen(false);
  if (!USER_ID || !editingEvent) return;
  try {
    const { request } = deleteEvent(USER_ID, editingEvent._id);
    await request;
    setEvents((prev) => prev.filter((e) => e._id !== editingEvent._id));
  } catch (err: any) {
    alert(err.message);
  }
  setEditingEvent(null);
  setModalDate(null);
};

const handleCancelDelete = () => setConfirmDeleteOpen(false);


  const closeModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
    setModalDate(null);
  };

  const getValidRangeEnd = () => {
    if (!weddingDate) return undefined;
    const date = new Date(weddingDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.toISOString().split("T")[0];
  };

  if (!user) return <div>...טוען משתמש</div>;

  return (
    <div className="pageMain">
      <div className="pageContainer">
        <Icons.BackArrowIcon
          className="backIcon"
          onClick={() => navigate(-1)}
          title="Go Back"
        />
        <h2 className="pageHeader">Calendar</h2>
        <div className={styles.calendarSection}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            validRange={{ end: getValidRangeEnd() }}
            events={events.map((e) => ({
              ...e,
              id: e._id,
              backgroundColor: e.color,
              textColor: "#222",
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
          <EventModal
            open={modalOpen}
            onClose={closeModal}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            initialTitle={editingEvent?.title || ""}
            initialColor={editingEvent?.color || "#ff69b4"}
            mode={modalMode}
          />
          <ConfirmDeleteModal
            isOpen={confirmDeleteOpen}
            eventTitle={editingEvent?.title || ''}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      </div>
    </div>
  );
}