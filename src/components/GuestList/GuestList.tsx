import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import styles from './GuestList.module.css';
import {
  fetchMyGuests,
  createGuest,
  sendInvitationToAllGuests,
  Guest,
} from '../../services/guest-service';

// Hardcoded wedding date
const WEDDING_DATE = '2025-08-10';

// Interface for imported Excel rows
interface GuestRow {
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: 'yes' | 'no' | 'maybe';
}

// Utility to read a cookie value
function getCookieValue(name: string): string | null {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
}

// Extract user data from cookie
const userCookie = getCookieValue('user');
let firstPartner = '';
let secondPartner = '';

if (userCookie) {
  try {
    const parsed = JSON.parse(userCookie);
    firstPartner = parsed.firstPartner || '';
    secondPartner = parsed.secondPartner || '';
  } catch (err) {
    console.error('Invalid user cookie:', err);
  }
}

console.log('Sending with:', {
  partner1: firstPartner,
  partner2: secondPartner,
  weddingDate: WEDDING_DATE,
});

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    rsvp: 'maybe' | 'yes' | 'no';
  }>({
    fullName: '',
    email: '',
    phone: '',
    rsvp: 'maybe',
  });

  const fetchGuests = async () => {
    try {
      const guests = await fetchMyGuests();
      setGuests(guests);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch guests');
      }
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
    } catch (err: unknown) {
      console.error('Failed to add guest:', err);
      alert('Error adding guest');
    }
  };

  const handleSendEmails = async () => {
    if (!firstPartner || !secondPartner) {
      alert('Missing partner names. Please log in again.');
      return;
    }

    try {
      await sendInvitationToAllGuests({
        partner1: firstPartner,
        partner2: secondPartner,
        weddingDate: WEDDING_DATE,
      });
      alert('Invitations sent to all guests!');
    } catch (err: unknown) {
      console.error('Failed to send invitations:', err);
      alert('Error sending invitations');
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
        } catch (err: unknown) {
          console.warn('Could not import guest:', guest.email, err);

          let reason = 'Unknown error';
          if (err instanceof Error) {
            reason = err.message;
          }

          failedImports.push({
            fullName: guest.fullName,
            email: guest.email,
            reason,
          });
        }
      }

      await fetchGuests();

      const successCount = newGuests.length - failedImports.length;

      if (failedImports.length > 0) {
        const failedList = failedImports
          .map((g) => `• ${g.fullName} (${g.email}) – ${g.reason}`)
          .join('\n');

        alert(`${successCount} guests imported successfully.\n\nThe following failed:\n${failedList}`);
      } else {
        alert(`${successCount} guests imported successfully.`);
      }
    } catch (err) {
      console.error('Failed to parse Excel file:', err);
      alert('Failed to import guests from file.');
    }
  };

  return (
    <div className={styles.guestPage}>
      <div className={styles.guestContainer}>
        <div className={styles.guestHeader}>Guest List</div>

        {/* Add Guest Form */}
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

        {/* Send Email Button */}
        <button onClick={handleSendEmails} className={styles.sendEmailButton}>
          📧 Send Invitation to All Guests
        </button>

        {/* Import Excel Button */}
        <label className={styles.importButton}>
          📥 Import Guests from Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            style={{ display: 'none' }}
          />
        </label>

        {/* Guest List */}
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
                <div className={styles.guestName}>{guest.fullName}</div>
                <div className={styles.guestEmail}>{guest.email}</div>
                {guest.phone && (
                  <div className={styles.guestPhone}>📞 {guest.phone}</div>
                )}
                {guest.rsvp && (
                  <div className={styles.guestRSVP}>RSVP: {guest.rsvp}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GuestList;
