import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GuestList.module.css'; 

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
        const response = await axios.get('/guests/mine');
        setGuests(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch guests');
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  return (
    <div className="guestPage">
      <div className="guestContainer">
        <div className="guestHeader">Guest List</div>

        {loading ? (
          <div className="emptyGuestList">Loading guests...</div>
        ) : error ? (
          <div className="emptyGuestList" style={{ color: 'red' }}>
            {error}
          </div>
        ) : guests.length === 0 ? (
          <div className="emptyGuestList">No guests found.</div>
        ) : (
          <ul className="guestList">
            {guests.map((guest) => (
              <li key={guest._id} className="guestItem">
                <div className="guestName">{guest.fullName}</div>
                <div className="guestEmail">{guest.email}</div>
                {guest.rsvp && (
                  <div className="guestRSVP">RSVP: {guest.rsvp}</div>
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
