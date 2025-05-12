import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Guest {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: 'yes' | 'no' | 'maybe';
}

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get('/guests/mine'); // Adjust if your API path is different
        setGuests(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch guests');
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  if (loading) return <p>Loading guests...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Guest List</h2>
      {guests.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <ul>
          {guests.map(guest => (
            <li key={guest._id}>
              <strong>{guest.fullName}</strong> — {guest.email}
              {guest.rsvp && ` (RSVP: ${guest.rsvp})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestList;
