import React, { useEffect, useMemo, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import styles from './GuestList.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as Icons from "../../icons/index";

import {
  fetchMyGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  sendInvitationToAllGuests,
  Guest,
} from '../../services/guest-service';


import { ConfirmGuestDeleteModal } from './DeleteGuestModal';

const GuestList: React.FC = () => {
  function getCookieValue(name: string): string | null {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }

  const userCookie = getCookieValue('user');
  let firstPartner = '', secondPartner = '', weddingDate = 'TBD', weddingVenue = 'TBD';
  if (userCookie) {
    try {
      const p = JSON.parse(decodeURIComponent(userCookie));
      firstPartner = p.firstPartner || '';
      secondPartner = p.secondPartner || '';
      weddingDate = p.weddingDate || 'TBD';
      weddingVenue = p.weddingVenue || 'TBD';
    } catch (err) {
      console.error('Error parsing user cookie:', userCookie, err);
    }
  }

  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<'all'|'yes'|'no'|'maybe'>('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    rsvp: 'maybe' as 'maybe'|'yes'|'no',
    numberOfGuests: 1
  });
  const [editingGuestId, setEditingGuestId] = useState<string|null>(null);
  const [editingGuests, setEditingGuests] = useState<Record<string,Guest>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

  const fetchGuests = async () => {
    try {
      const data = await fetchMyGuests();
      setGuests(data);
    } catch (err) {
      console.error('Failed to fetch guests:', err);
      toast.error('Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchGuests(); }, []);

  const guestStats = useMemo(() => {
    const total = guests.reduce((sum, g) => sum + (g.numberOfGuests ?? 1), 0);
    const yes   = guests.filter(g => g.rsvp === 'yes').reduce((sum, g) => sum + (g.numberOfGuests ?? 1), 0);
    const no    = guests.filter(g => g.rsvp === 'no').reduce((sum, g) => sum + (g.numberOfGuests ?? 1), 0);
    const maybe = guests.filter(g => g.rsvp === 'maybe').reduce((sum, g) => sum + (g.numberOfGuests ?? 1), 0);
    return { total, yes, no, maybe };
  }, [guests]);

  const displayed = useMemo(() => {
    if (filter === 'all') return guests;
    return guests.filter(g => g.rsvp === filter);
  }, [guests, filter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'numberOfGuests' ? parseInt(value) || 1 : value
    });
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGuest(form);
      setForm({ fullName: '', email: '', phone: '', rsvp: 'maybe', numberOfGuests: 1 });
      await fetchGuests();
      toast.success('Guest added');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const message = axiosErr?.response?.data?.message || 'Error adding guest';
        toast.error(message);
      } else {
        toast.error('Error adding guest');
      }
    }
  };

  const handleSendEmails = async () => {
    if (!firstPartner || !secondPartner) {
      toast.error('Missing partner info');
      return;
    }

    const valid = guests
      .filter(g => g.fullName && g.email && g._id && g.rsvpToken)
      .map(g => ({
        fullName: g.fullName,
        email: g.email,
        guestId: g._id,
        rsvpToken: g.rsvpToken
      }));

    if (!valid.length) {
      toast.error('No guests to invite');
      return;
    }

    const toastId = toast.info('Sending invitations...', { autoClose: false });
    setSending(true);

    try {
      await sendInvitationToAllGuests({
        partner1: firstPartner,
        partner2: secondPartner,
        weddingDate: weddingDate,
        venue: weddingVenue,
        guests: valid
      });

      toast.update(toastId, {
        render: 'Invitations sent',
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });

    } catch (err) {
        console.error('Error sending invites:', err);
        toast.update(toastId, {
          render: 'Error sending invitations',
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
    } finally {
      setSending(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      type ExcelGuestRow = {
        fullName: string;
        email: string;
        phone?: string;
        rsvp?: 'yes' | 'no' | 'maybe';
        numberOfGuests?: number;
      };
      const rows: ExcelGuestRow[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const failed: (ExcelGuestRow & { error: string })[] = [];
      for (const r of rows.filter(r => r.fullName && r.email)) {
        try {
          await createGuest({
            fullName: r.fullName,
            email: r.email,
            phone: r.phone || '',
            rsvp: r.rsvp || 'maybe',
            numberOfGuests: parseInt(String(r.numberOfGuests)) || 1
          });
        } catch (err: unknown) {
          const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Unknown error';
          failed.push({ ...r, error: message });
        }
      }
      await fetchGuests();
      if (failed.length) {
        toast.error(`${failed.length} failed to import`);
        console.table(failed);
      } else {
        toast.success('Imported');
      }
    } catch (err) {
      console.error('Import error:', err);
      toast.error('Import error');
    }
  };

  const handleExportExcel = () => {
    const exclude = new Set(['_id', 'userId', '__v', 'rsvpToken', 'tableId']);
    const data = guests.map(g =>
      Object.fromEntries(
        Object.entries(g).filter(([k]) => !exclude.has(k))
      )
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guests');
    XLSX.writeFile(wb, 'guest-list.xlsx');
  };

  const handleDelete = (guest: Guest) => {
    setGuestToDelete(guest);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!guestToDelete) return;
    try {
      await deleteGuest(guestToDelete._id);
      await fetchGuests();
      toast.success('Guest deleted');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Delete error');
    } finally {
      setShowDeleteModal(false);
      setGuestToDelete(null);
    }
  };

  const handleEditChange = (id: string, field: keyof Guest, val: string) => {
    setEditingGuests(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || guests.find(g => g._id === id))!,
        [field]: field === 'numberOfGuests' ? parseInt(val) || 1 : val
      }
    }));
  };

  const handleSave = async (g: Guest) => {
    const upd = editingGuests[g._id];
    if (!upd.fullName || !upd.email) {
      toast.error('Name & email required');
      return;
    }
    try {
      await updateGuest(g._id, upd);
      setEditingGuestId(null);
      setEditingGuests(prev => { const c = { ...prev }; delete c[g._id]; return c; });
      await fetchGuests();
      toast.success('Guest updated');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Save error';
      toast.error(message);
    }
  };

  return (
    <div className="pageMain">
      <div className="pageContainer">
        <Icons.BackArrowIcon className="backIcon  " onClick={() => navigate(-1)} title="Go Back" />
        <h2 className="pageHeader">Guest List</h2>

        <form className={styles.guestForm}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Please enter a valid email address (e.g. name@example.com)"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <input
            name="numberOfGuests"
            type="number"
            min={1}
            value={form.numberOfGuests}
            onChange={handleInputChange}
            placeholder="# Guests"
          />
          <span onClick={handleAddGuest} className='icon' title='Add Guest'><Icons.AddIcon/></span>
        </form>

        <div className={styles.toolbar}>
          <div className={styles.actionsContainer}>
            <div className={styles.iconAction} onClick={() => !sending && handleSendEmails()} style={{ opacity: sending ? 0.5 : 1 }}>
              <Icons.SendIcon className="icon" title="Send RSVP"/>
              <span className={styles.iconLabel}>Send RSVP</span>
            </div>
            <div className={styles.iconAction} onClick={() => fileInputRef.current?.click()}>
              <Icons.ImportIcon className="icon" title='Import Guest List' />
              <span className={styles.iconLabel}>Import Excel</span>
            </div>
            <div className={styles.iconAction} onClick={handleExportExcel}>
              <Icons.ExportIcon className="icon" title='Export Guest List'/>
              <span className={styles.iconLabel}>Export Excel</span>
            </div>
            <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={handleExcelUpload} style={{ display: 'none' }} />
          </div>

          <div className={styles.actionsContainer}>
            {['all', 'yes', 'no', 'maybe'].map((key, index) => {
              const Icon = [Icons.FilterIcon, Icons.CheckIcon, Icons.CloseIcon, Icons.MaybeIcon][index];
              const label = ['Total', 'Yes', 'No', 'Maybe'][index];
              const count = [guestStats.total, guestStats.yes, guestStats.no, guestStats.maybe][index];
              return (
                <div key={key} className={`${styles.iconAction} ${filter === key ? styles.activeFilter : ''}`} onClick={() => setFilter(key as 'all' | 'yes' | 'no' | 'maybe')}>
                  <Icon className="icon" />
                  <span className={styles.iconLabel}>{label}: {count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className={styles.emptyGuestList}><Icons.LoaderIcon className='spinner'/></div>
        ) : displayed.length === 0 ? (
          <div className={styles.emptyGuestList}>{filter === 'all' ? 'No guests' : 'No ' + filter + ' responses'}</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.guestTable}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>RSVP</th>
                  <th># Guests</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(g => (
                  editingGuestId === g._id ? (
                    <tr key={g._id}>
                      <td><input className={styles.tableInput} value={editingGuests[g._id]?.fullName || g.fullName} onChange={e => handleEditChange(g._id, 'fullName', e.target.value)} /></td>
                      <td><input className={styles.tableInput} value={editingGuests[g._id]?.email || g.email} onChange={e => handleEditChange(g._id, 'email', e.target.value)} /></td>
                      <td><input className={styles.tableInput} value={editingGuests[g._id]?.phone || g.phone || ''} onChange={e => handleEditChange(g._id, 'phone', e.target.value)} /></td>
                      <td>
                        <select className={styles.tableSelect} value={editingGuests[g._id]?.rsvp || g.rsvp} onChange={e => handleEditChange(g._id, 'rsvp', e.target.value)}>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="maybe">Maybe</option>
                        </select>
                      </td>
                      <td><input type="number" min={1} className={styles.tableInput} value={editingGuests[g._id]?.numberOfGuests ?? g.numberOfGuests ?? 1} onChange={e => handleEditChange(g._id, 'numberOfGuests', e.target.value)} /></td>
                      <td>
                        <Icons.SaveIcon className="icon" onClick={() => handleSave(g)} title='Save Guest'/>
                        <Icons.CloseIcon className="icon" onClick={() => setEditingGuestId(null)} title='Canccle Edit'/>
                      </td>
                    </tr>
                  ) : (
                    <tr key={g._id}>
                      <td>{g.fullName}</td>
                      <td>{g.email}</td>
                      <td>{g.phone || '—'}</td>
                      <td className={styles[`status_${g.rsvp}`]}>{g.rsvp}</td>
                      <td>{g.numberOfGuests ?? 1}</td>
                      <td>
                        <Icons.EditIocn className="icon" onClick={() => setEditingGuestId(g._id)} title='Edit Guest'/>
                        <Icons.DeleteIcon className="icon" onClick={() => handleDelete(g)} title='Delete Guest'/>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}

        {guestToDelete && (
          <ConfirmGuestDeleteModal
            isOpen={showDeleteModal}
            guestName={guestToDelete.fullName}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default GuestList;
