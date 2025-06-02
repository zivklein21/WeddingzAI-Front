import { useEffect, useState } from "react";
import {
  fetchMyGuests,
  assignGuestToTable,
  Guest,
} from "../../services/guest-service";
import { getAvailableTables } from "../../services/seating-service";
import styles from "./UnassignedGuestList.module.css";

export default function UnassignedGuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<any[]>([]);

  const fetchGuests = async () => {
    try {
      const data = await fetchMyGuests();
      const unassigned = data.filter((g) => !g.tableId);
      setGuests(unassigned);
    } catch (err) {
      console.error("Error fetching guests:", err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleGuestClick = async (guest: Guest) => {
    if (selectedGuestId === guest._id) {
      setSelectedGuestId(null);
      setAvailableTables([]);
      return;
    }
    setSelectedGuestId(guest._id);
    const tables = await getAvailableTables(guest.numberOfGuests ?? 1);
    setAvailableTables(tables);
  };

  const handleTableSelection = async (guestId: string, tableId: string) => {
    await assignGuestToTable(guestId, tableId);
    setSelectedGuestId(null);
    setAvailableTables([]);
    fetchGuests(); // רענון הרשימה לאחר השיבוץ
  };

  return (
    <div className={styles.sidebar}>
      <h3>Unassigned Guests</h3>
      <ul className={styles.list}>
        {guests.length === 0 ? (
          <li>All guests are assigned</li>
        ) : (
          guests.map((guest) => (
            <li
              key={guest._id}
              onClick={() => handleGuestClick(guest)}
              className={selectedGuestId === guest._id ? styles.selected : ""}
            >
              {guest.fullName} ({guest.numberOfGuests ?? 1})
              {selectedGuestId === guest._id && (
                <ul className={styles.tablesList}>
                  {availableTables.length === 0 ? (
                    <li>No available tables</li>
                  ) : (
                    availableTables.map((table) => (
                      <li key={table._id}>
                        <button
                          onClick={() =>
                            handleTableSelection(guest._id, table._id)
                          }
                        >
                          {table.name} (Seats:{" "}
                          {table.freeSeats ?? table.capacity})
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
