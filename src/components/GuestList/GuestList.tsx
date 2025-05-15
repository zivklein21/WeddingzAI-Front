import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import styles from './GuestList.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchMyGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  sendInvitationToAllGuests,
  Guest,
} from '../../services/guest-service';

const WEDDING_DATE = '2025-08-10';

interface GuestRow {
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: 'yes' | 'no' | 'maybe';
}

function getCookieValue(name: string): string | null {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
}

const userCookie = getCookieValue('user');
let firstPartner = '';
let secondPartner = '';

if (userCookie) {
  try {
    const parsed = JSON.parse(userCookie);
    firstPartner = parsed.firstPartner || '';
    secondPartner = parsed.secondPartner || '';
  } catch {
    // intentionally ignored
  }
}

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    rsvp: 'maybe' as 'maybe' | 'yes' | 'no',
  });
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);

  const fetchGuests = async () => {
    try {
      const guests = await fetchMyGuests();
      setGuests(guests);
    } catch {
      setError('Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGuest(form);
      setForm({ fullName: '', email: '', phone: '', rsvp: 'maybe' });
      await fetchGuests();
      toast.success('Guest added successfully!');
    } catch {
      toast.error('Error adding guest.');
    }
  };

  const handleSendEmails = async () => {
    if (!firstPartner || !secondPartner) {
      toast.error('Missing partner names. Please log in again.');
      return;
    }

    try {
      await sendInvitationToAllGuests({
        partner1: firstPartner,
        partner2: secondPartner,
        weddingDate: WEDDING_DATE,
      });
      toast.success('Invitations sent to all guests!');
    } catch {
      toast.error('Error sending invitations');
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: GuestRow[] = XLSX.utils.sheet_to_json<GuestRow>(sheet);

      const newGuests = rows.filter((row) => row.fullName && row.email);
      const failedImports: { fullName: string; email: string; reason: string }[] = [];

      for (const guest of newGuests) {
        try {
          await createGuest({
            fullName: guest.fullName,
            email: guest.email,
            phone: guest.phone || '',
            rsvp: guest.rsvp || 'maybe',
          });
        } catch {
          failedImports.push({
            fullName: guest.fullName,
            email: guest.email,
            reason: 'Could not import (maybe duplicate)',
          });
        }
      }

      await fetchGuests();

      const successCount = newGuests.length - failedImports.length;
      if (failedImports.length > 0) {
        toast.error(
          <div>
            <strong>Some guests could not be imported:</strong>
            <br />✅ Successfully imported: {successCount}
            <br />❌ Failed to import: {failedImports.length}
            <ul>
              {failedImports.map((g) => (
                <li key={g.email}>
                  {g.fullName} ({g.email}) — {g.reason}
                </li>
              ))}
            </ul>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.success(`${successCount} guests imported successfully 🎉`);
      }
    } catch {
      toast.error('Failed to import guests from file.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGuest(id);
      await fetchGuests();
      toast.success('Guest deleted successfully.');
    } catch {
      toast.error('Error deleting guest.');
    }
  };

  const handleEditChange = (id: string, field: keyof Guest, value: string) => {
    setGuests((prev) =>
      prev.map((g) => (g._id === id ? { ...g, [field]: value } : g))
    );
  };

  const handleSave = async (guest: Guest) => {
    try {
      await updateGuest(guest._id, guest);
      setEditingGuestId(null);
      await fetchGuests();
      toast.success('Guest updated.');
    } catch {
      toast.error('Error updating guest.');
    }
  };

  return (
    <div className={styles.guestPage}>
      <div className={styles.guestContainer}>
        <div className={styles.guestHeader}>Guest List</div>

        <form onSubmit={handleAddGuest} className={styles.guestForm}>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            placeholder="Full Name"
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            placeholder="Phone"
            onChange={handleInputChange}
          />
          <select name="rsvp" value={form.rsvp} onChange={handleInputChange}>
            <option value="maybe">Maybe</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button type="submit">+ Add Guest</button>
        </form>

        <button onClick={handleSendEmails} className={styles.sendEmailButton}>
          📧 Send Invitation to All Guests
        </button>

        <label className={styles.importButton}>
          📅 Import Guests from Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            style={{ display: 'none' }}
          />
        </label>

        {loading ? (
          <div className={styles.emptyGuestList}>Loading guests...</div>
        ) : error ? (
          <div className={styles.emptyGuestList} style={{ color: 'red' }}>
            {error}
          </div>
        ) : guests.length === 0 ? (
          <div className={styles.emptyGuestList}>No guests found.</div>
        ) : (
          <ul className={styles.guestList}>
            {guests.map((guest) => (
              <li key={guest._id} className={styles.guestItem}>
                {editingGuestId === guest._id ? (
                  <>
                    <input
                      value={guest.fullName}
                      onChange={(e) =>
                        handleEditChange(guest._id, 'fullName', e.target.value)
                      }
                    />
                    <input
                      value={guest.email}
                      onChange={(e) =>
                        handleEditChange(guest._id, 'email', e.target.value)
                      }
                    />
                    <input
                      value={guest.phone || ''}
                      onChange={(e) =>
                        handleEditChange(guest._id, 'phone', e.target.value)
                      }
                    />
                    <select
                      value={guest.rsvp}
                      onChange={(e) =>
                        handleEditChange(guest._id, 'rsvp', e.target.value)
                      }
                    >
                      <option value="maybe">Maybe</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <button onClick={() => handleSave(guest)}>💾 Save</button>
                    <button onClick={() => setEditingGuestId(null)}>
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.guestName}>{guest.fullName}</div>
                    <div className={styles.guestEmail}>{guest.email}</div>
                    {guest.phone && (
                      <div className={styles.guestPhone}>📞 {guest.phone}</div>
                    )}
                    {guest.rsvp && (
                      <div className={styles.guestRSVP}>RSVP: {guest.rsvp}</div>
                    )}
                    <div className={styles.guestActions}>
                      <button onClick={() => setEditingGuestId(guest._id)}>
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(guest._id)}>
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default GuestList;
