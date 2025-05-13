import React, { useEffect, useState } from 'react';
import styles from './GuestList.module.css';
import { fetchMyGuests, Guest } from '../../services/guest-service';

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const guests = await fetchMyGuests();
        console.log('Fetched my guests:', guests);
        setGuests(guests);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Fetch error:', err);
          setError(err.message);
        } else {
          setError('Failed to fetch guests');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchGuests();
  }, []);

  return (
    <div className={styles.guestPage}>
      <div className={styles.guestContainer}>
        <div className={styles.guestHeader}>Guest List</div>

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
