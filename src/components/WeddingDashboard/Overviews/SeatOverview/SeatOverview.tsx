import { useState, useEffect } from "react";
import { getMyTables } from "../../../../services/seating-service";
import { fetchMyGuests } from "../../../../services/guest-service";
import { Guest } from "../../../../types/guest";
import styles from "./SeatOverview.module.css";
import * as Icons from "../../../../icons/index.ts";

// נניח שטיפוס TableType מכיל at least את השדות _id, name, capacity
type TableType = {
  _id: string;
  name: string;
  capacity: number;
};

export default function SeatOverview() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const tablesData = await getMyTables();
        setTables(tablesData || []);

        const guestsData = await fetchMyGuests();
        setGuests(guestsData || []);
      } catch (err) {
        console.error("Error fetching tables or guests:", err);
        setError("Failed to load seating overview.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loader}><Icons.LoaderIcon className="spinner" /></div>;
  }

  if (error) {
    return <div className={styles.error}><Icons.ErrorIcon className="errorIcon"/></div>;
  }

  const tablesCount = tables.length;
  const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);

  const assignedGuests = guests.filter((g) => !!g.tableId);

  const seatsUsed = assignedGuests.reduce(
    (sum, g) => sum + (g.numberOfGuests || 1),
    0
  );

  const unassignedSeats = Math.max(totalSeats - seatsUsed, 0);

  const unassignedGuestsCount = guests.filter((g) => !g.tableId).length;

  type Status = "green" | "yellow" | "red";

  const tableStatuses: Status[] = tables.map((table) => {
    const usedAtThisTable = guests
      .filter((g) => g.tableId === table._id)
      .reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);

    if (usedAtThisTable === 0) {
      return "red";
    }
    if (usedAtThisTable >= table.capacity) {
      return "green";
    }
    return "yellow";
  });

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.statsSection}>
        <div className={styles.statLine}>
          <span className={styles.statLabel}>Tables:</span>
          <span className={styles.statValue}>{tablesCount}</span>
        </div>
        <div className={styles.statLine}>
          <span className={styles.statLabel}>Seats used:</span>
          <span className={styles.statValue}>
            {seatsUsed} / {totalSeats}
          </span>
        </div>
        <div className={styles.statLine}>
          <span className={styles.statLabel}>Unassigned seats:</span>
          <span className={styles.statValue}>{unassignedSeats}</span>
        </div>
        <div className={styles.statLine}>
          <span className={styles.statLabel}>Unassigned guests:</span>
          <span className={styles.statValue}>{unassignedGuestsCount}</span>
        </div>
      </div>

      {tablesCount > 0 && (
        <div className={styles.circleGrid}>
          {tables.map((table, idx) => {
            const status = tableStatuses[idx];
            return (
              <div
                key={table._id}
                className={`${styles.circle} ${
                  status === "green"
                    ? styles.green
                    : status === "yellow"
                    ? styles.yellow
                    : styles.red
                }`}
                title={`${table.name}: ${
                  status === "green"
                    ? "Fully seated"
                    : status === "yellow"
                    ? "Partially seated"
                    : "Empty"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}