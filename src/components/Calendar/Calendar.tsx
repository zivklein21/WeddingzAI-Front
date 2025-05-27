import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./fc.css";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../../services/calendar-service';
import { useAuth } from '../../hooks/useAuth/AuthContext';
import styles from './Calendar.module.css';
import EventModal from './EventModal';
import {FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

type CalendarEvent = {
  _id: string;
  title: string;
  date: string;
  color?: string;
};

const WEDDING_EVENT_TITLE = 'My Wedding 🌸';
const WEDDING_EVENT_COLOR = '#ff69b4';

export default function CalendarPage() {
    const navigate = useNavigate();
  const { user } = useAuth();
  const USER_ID = user?._id;
  const weddingDate = user?.weddingDate;
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create'|'edit'|'delete'>('create');
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Load events and ensure wedding event exists
  useEffect(() => {
    if (!USER_ID || !weddingDate) return;
    const { request } = getEvents(USER_ID);
    request.then(res => {
      let events = res.data;
      // בדוק אם כבר יש אירוע חתונה
      const hasWedding = events.some((ev: CalendarEvent) =>
        ev.date.startsWith(weddingDate) && ev.title === WEDDING_EVENT_TITLE
      );
      // אם לא, הוסף אירוע חתונה
      if (!hasWedding) {
        createEvent(USER_ID, {
          title: WEDDING_EVENT_TITLE,
          date: weddingDate,
          color: WEDDING_EVENT_COLOR,
        }).request.then((addRes) => {
          setEvents([...events, addRes.data]);
        });
      } else {
        setEvents(events);
      }
    }).catch(err => alert(err.message));
  }, [USER_ID, weddingDate]);

  // הוספת אירוע חדש
  const handleDateClick = (arg: { dateStr: string }) => {
    setModalDate(arg.dateStr);
    setEditingEvent(null);
    setModalMode('create');
    setModalOpen(true);
  };

  // עריכת אירוע
  const handleEventClick = (arg: { event: any }) => {
    const eventObj = events.find(e => e._id === arg.event.id);
    if (!eventObj) return;
    setEditingEvent(eventObj);
    setModalDate(eventObj.date);
    setModalMode('edit');
    setModalOpen(true);
  };

  // שמירת אירוע חדש או ערוך
  const handleSaveEvent = async ({ title, color }: { title: string; color: string }) => {
    setModalOpen(false);
    if (!USER_ID || !modalDate) return;

    if (modalMode === 'create') {
      try {
        const { request } = createEvent(USER_ID, { title, color, date: modalDate });
        const res = await request;
        setEvents(prev => [...prev, res.data]);
      } catch (err: any) {
        alert(err.message);
      }
    } else if (modalMode === 'edit' && editingEvent) {
      try {
        const { request } = updateEvent(USER_ID, editingEvent._id, { title, color });
        const res = await request;
        setEvents(prev => prev.map(e => (e._id === editingEvent._id ? res.data : e)));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // מעבר למצב מחיקה
  const handleDeleteEvent = () => {
    setModalMode('delete');
    setModalOpen(true);
  };

  // מחיקת אירוע
  const handleConfirmDelete = async () => {
  setModalOpen(false);
  if (!USER_ID || !editingEvent) return;
  try {
    const { request } = deleteEvent(USER_ID, editingEvent._id);
    await request;
    setEvents(prev => prev.filter(e => e._id !== editingEvent._id));
  } catch (err: any) {
    alert(err.message);
  }
  setEditingEvent(null);
  setModalDate(null);
};

  // סוגר את המודל ומנקה
  const closeModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
    setModalDate(null);
  };

  // חישוב תאריך אחרון בלוח
  const getValidRangeEnd = () => {
    if (!weddingDate) return undefined;
    const date = new Date(weddingDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.toISOString().split('T')[0];
  };

  if (!user) return <div>...טוען משתמש</div>;

  return (
    <div className={styles.calendarPage}>
        
    <div className={styles.calendarContainer}>
        <FiArrowLeft className={styles.backIcon} onClick={() => navigate(-1)} title="Go Back" />
        <h2 className={styles.calendarHeader}>Guest List</h2>
        <div className={styles.calendarSection}>
            <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            validRange={{ end: getValidRangeEnd() }}
            events={events.map(e => ({
                    ...e,
                    id: e._id,
                    backgroundColor: e.color,
                    textColor: "#222", // ⬅️ זאת השורה שחשובה!
                }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            />
            <EventModal
            open={modalOpen}
            onClose={closeModal}
            onSave={handleSaveEvent}
            onDelete={handleConfirmDelete}   // זה מה שחשוב!
            initialTitle={editingEvent?.title || ''}
            initialColor={editingEvent?.color || '#ff69b4'}
            mode={modalMode}
            />
        </div>
    </div>
    </div>
  );
}

// בונוס: הצגת צבע ו-emoji ביומן
function renderEventContent(arg: any) {
  return (
    <span style={{ color: arg.event.backgroundColor || arg.event.extendedProps.color }}>
      {arg.event.title}
    </span>
  );
}