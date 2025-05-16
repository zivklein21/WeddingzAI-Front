import React, { useEffect, useMemo, useState, useRef } from 'react';
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

import { FiSend, FiDownload, FiUpload } from 'react-icons/fi';
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { FiBarChart2, FiCheckCircle, FiXCircle, FiHelpCircle } from 'react-icons/fi';


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
  const [editingGuests, setEditingGuests] = useState<Record<string, Guest>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    rsvp: 'maybe' as 'maybe' | 'yes' | 'no',
  });
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchGuests = async () => {
    try {
      const data = await fetchMyGuests();
      setGuests(data);
    } catch {
      setError('Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const guestStats = useMemo(() => {
    const total = guests.length;
    const yes = guests.filter((g) => g.rsvp === 'yes').length;
    const no = guests.filter((g) => g.rsvp === 'no').length;
    const maybe = guests.filter((g) => g.rsvp === 'maybe').length;
    return { total, yes, no, maybe };
  }, [guests]);

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
    console.log(secondPartner);
    console.log(firstPartner);

    if (!firstPartner || !secondPartner) {
      toast.error('Missing partner names. Please log in again.');
      return;
    }

    const validGuests = guests
      .filter((g) => g.email && g.fullName)
      .map((g) => ({
        email: g.email,
        fullName: g.fullName,
      }));

    if (validGuests.length === 0) {
      toast.error('No valid guests to send invitations.');
      return;
    }

    setSending(true);
    try {
      await sendInvitationToAllGuests({
        partner1: firstPartner,
        partner2: secondPartner,
        weddingDate: WEDDING_DATE,
        guests: validGuests,
      });
      toast.success('Invitations sent!');
    } catch {
      toast.error('Error sending invitations.');
    } finally {
      setSending(false);
    }
  };

  const handleExcelUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: GuestRow[] = XLSX.utils.sheet_to_json(sheet);

      const newGuests = rows.filter((r) => r.fullName && r.email);
      const failed: { fullName: string; email: string; reason: string }[] = [];

      for (const guest of newGuests) {
        try {
          await createGuest({
            fullName: guest.fullName,
            email: guest.email,
            phone: guest.phone || '',
            rsvp: guest.rsvp || 'maybe',
          });
        } catch {
          failed.push({
            fullName: guest.fullName,
            email: guest.email,
            reason: 'Duplicate or error',
          });
        }
      }

      await fetchGuests();

      if (failed.length > 0) {
        toast.error(
          <div>
            Some guests failed to import:
            <ul>
              {failed.map((f) => (
                <li key={f.email}>
                  {f.fullName} ({f.email}) — {f.reason}
                </li>
              ))}
            </ul>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.success('Guests imported successfully!');
      }
    } catch {
      toast.error('Failed to process Excel file.');
    }
  };

  const handleExportExcel = () => {
    const excludedKeys = new Set(['_id', 'userId', '__v']);
    const exportGuests = guests.map((g) =>
      Object.fromEntries(Object.entries(g).filter(([key]) => !excludedKeys.has(key)))
    );
    const worksheet = XLSX.utils.json_to_sheet(exportGuests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');
    XLSX.writeFile(workbook, 'guest-list.xlsx');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGuest(id);
      await fetchGuests();
      toast.success('Guest deleted.');
    } catch {
      toast.error('Error deleting guest.');
    }
  };

  const handleEditChange = (id: string, field: keyof Guest, value: string) => {
    setEditingGuests((prev) => ({
      ...prev,
      [id]: {
        ...guests.find((g) => g._id === id)!,
        ...(prev[id] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async (guest: Guest) => {
    const updatedGuest = editingGuests[guest._id];

    if (!updatedGuest.fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }

    if (!updatedGuest.email.trim()) {
      toast.error('Email is required.');
      return;
    }

    const phone = updatedGuest.phone?.trim() || '';
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (phone && !phoneRegex.test(phone)) {
      toast.error('Phone number is invalid. It must contain only digits and optionally start with +');
      return;
    }

    try {
      await updateGuest(guest._id, updatedGuest);
      setEditingGuestId(null);
      setEditingGuests((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([key]) => key !== guest._id)
        )
      );
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
          <input type="text" name="fullName" value={form.fullName} placeholder="Full Name" onChange={handleInputChange} required />
          <input type="email" name="email" value={form.email} placeholder="Email" onChange={handleInputChange} required />
          <input type="tel" name="phone" value={form.phone} placeholder="Phone" onChange={handleInputChange} />
          {/* <select name="rsvp" value={form.rsvp} onChange={handleInputChange}>
            <option value="maybe">Maybe</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select> */}
          <button type="submit">+ Add Guest</button>
        </form>
              <div className={styles.toolbar}>
                <div className={styles.actionsContainer}>
                  {/* Send Invitations */}
                  <div
                    className={`${styles.iconAction} ${
                      sending ? styles.disabled : ''
                    }`}
                    onClick={() => !sending && handleSendEmails()}
                    title={sending ? 'Sending…' : 'Send Invitations'}
                  >
                    <FiSend className={styles.actionIcon} />
                    <span className={styles.iconLabel}>Send Invitations</span>
                  </div>

                  {/* Import from Excel */}
                  <div
                    className={styles.iconAction}
                    onClick={() => fileInputRef.current?.click()}
                    title="Import"
                  >
                    <FiDownload className={styles.actionIcon} />
                    <span className={styles.iconLabel}>Import from Excel</span>
                  </div>

                  {/* Export to Excel */}
                  <div
                    className={styles.iconAction}
                    onClick={handleExportExcel}
                    title="Export"
                  >
                    <FiUpload className={styles.actionIcon} />
                    <span className={styles.iconLabel}>Export to Excel</span>
                  </div>

                  {/* hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .xls"
                    onChange={handleExcelUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                {guests.length > 0 && (
                    <div className={styles.actionsContainer}>
                      <div className={styles.iconAction}>
                        <FiBarChart2 className={styles.actionIcon} />
                        <span className={styles.iconLabel}>Total: {guestStats.total}</span>
                      </div>
                      <div className={styles.iconAction}>
                        <FiCheckCircle className={styles.actionIcon} />
                        <span className={styles.iconLabel}>Yes: {guestStats.yes}</span>
                      </div>
                      <div className={styles.iconAction}>
                        <FiXCircle className={styles.actionIcon} />
                        <span className={styles.iconLabel}>No: {guestStats.no}</span>
                      </div>
                      <div className={styles.iconAction}>
                        <FiHelpCircle className={styles.actionIcon} />
                        <span className={styles.iconLabel}>Maybe: {guestStats.maybe}</span>
                      </div>
                    </div>
                )}
                </div>

        {loading ? (
          <div className={styles.emptyGuestList}>Loading guests...</div>
        ) : error ? (
          <div className={styles.emptyGuestList} style={{ color: 'red' }}>{error}</div>
        ) : guests.length === 0 ? (
          <div className={styles.emptyGuestList}>No guests found.</div>
        ) : (
          <table className={styles.guestTable}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>RSVP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                editingGuestId === guest._id ? (
                  <tr key={guest._id}>
                    <td>
                      <input
                        value={editingGuests[guest._id]?.fullName ?? guest.fullName}
                        onChange={e => handleEditChange(guest._id, 'fullName', e.target.value)}
                        className={styles.tableInput}
                      />
                    </td>
                    <td>
                      <input
                        value={editingGuests[guest._id]?.email ?? guest.email}
                        onChange={e => handleEditChange(guest._id, 'email', e.target.value)}
                        className={styles.tableInput}
                      />
                    </td>
                    <td>
                      <input
                        value={editingGuests[guest._id]?.phone ?? guest.phone ?? ''}
                        onChange={e => handleEditChange(guest._id, 'phone', e.target.value)}
                        className={styles.tableInput}
                      />
                    </td>
                    <td>
                      <select
                        value={editingGuests[guest._id]?.rsvp ?? guest.rsvp}
                        onChange={e => handleEditChange(guest._id, 'rsvp', e.target.value)}
                        className={styles.tableSelect}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="maybe">Maybe</option>
                      </select>
                    </td>
                    <td>
                      <FiSave
                        className={styles.actionIcon}
                        onClick={() => handleSave(guest)}
                        title="Save"
                      />
                      <FiX
                        className={styles.actionIcon}
                        onClick={() => setEditingGuestId(null)}
                        title="Cancel"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={guest._id}>
                    <td>{guest.fullName}</td>
                    <td>{guest.email}</td>
                    <td>{guest.phone || '—'}</td>
                    <td className={styles[`status_${guest.rsvp}`]}>
                      {guest.rsvp}
                    </td>
                    <td>
                      <FiEdit2
                        className={styles.actionIcon}
                        onClick={() => setEditingGuestId(guest._id)}
                        title="Edit"
                      />
                      <FiTrash2
                        className={styles.actionIcon}
                        onClick={() => handleDelete(guest._id)}
                        title="Delete"
                      />
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default GuestList;
