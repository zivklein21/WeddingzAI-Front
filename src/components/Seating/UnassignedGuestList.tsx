import { useState } from "react";
import { Guest } from "../../types/guest";
import { assignGuestToTable } from "../../services/guest-service";
import { getAvailableTables } from "../../services/seating-service";
import styles from "./UnassignedGuestList.module.css";

interface UnassignedGuestListProps {
  guests: Guest[];
  refreshGuests: () => void;
  refreshTables: () => void;
  updateLocalTableGuests: (tableId: string, guest: Guest) => void;
}

export default function UnassignedGuestList({
  guests,
  refreshGuests,
  refreshTables,
  updateLocalTableGuests,
}: UnassignedGuestListProps) {
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<any[]>([]);

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
    refreshGuests();
    refreshTables();
    const assignedGuest = guests.find((g) => g._id === guestId);
    if (assignedGuest) {
      updateLocalTableGuests(tableId, assignedGuest);
    }
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
                      <li key={table._id} className={styles.table}>
                        <span
                          className={styles.guest}
                          onClick={() =>
                            handleTableSelection(guest._id, table._id)
                          }
                        >
                          {table.name} (Seats:{" "}
                          {table.freeSeats ?? table.capacity})
                        </span>
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
