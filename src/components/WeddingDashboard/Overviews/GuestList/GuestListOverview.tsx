import { useEffect, useState } from "react";
import guestService, { Guest } from "../../../../services/guest-service";
import styles from "./GuestListOverview.module.css";
import * as Icons from "../../../../icons/index";

export default function GuestListOverview() {
  const [guestSummary, setGuestSummary] = useState({
    total: 0,
    yes: 0,
    no: 0,
    maybe: 0,
    totalInvited: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    guestService
      .fetchMyGuests()
      .then((guests: Guest[]) => {
        const summary = {
          total: guests.length,
          yes: guests.filter((g) => g.rsvp === "yes").length,
          no: guests.filter((g) => g.rsvp === "no").length,
          maybe: guests.filter((g) => g.rsvp === "maybe").length,
          totalInvited: guests.reduce((sum, g) => sum + (g.numberOfGuests ?? 1), 0),
        };
        setGuestSummary(summary);
      })
      .catch((err) => {
        console.error("Could not load guests:", err);
        setError("Failed to load guest list");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.summaryContainer}><Icons.LoaderIcon className="spinner"/></div>;
  }

  if (error) {
    return <div className={styles.summaryContainer}><Icons.ErrorIcon className="errorIcon"/></div>;
  }

  return (
    <div>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Guest Entries:</span>
          <span className={styles.summaryValue}>{guestSummary.total}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Actual People Invited:</span>
          <span className={styles.summaryValue}>{guestSummary.totalInvited}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Confirmed:</span>
          <span className={styles.summaryValue}>
            {guestSummary.yes}{" "}
            <small className={styles.summaryPercent}>
              (
              {guestSummary.total
                ? Math.round((guestSummary.yes / guestSummary.total) * 100)
                : 0}
              %)
            </small>
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Pending:</span>
          <span className={styles.summaryValue}>
            {guestSummary.total - guestSummary.yes}
          </span>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${
              guestSummary.total
                ? (guestSummary.yes / guestSummary.total) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  );
}