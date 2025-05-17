import { useEffect, useState } from "react";
import guestService, { Guest } from "../../../services/guest-service";
import styles from "./GuestListOverview.module.css";

export default function GuestListOverview() {
    const [guestSummary, setGuestSummary] = useState({
        total: 0,
        yes: 0,
        no: 0,
        maybe: 0,
    });


    useEffect(() => {
        guestService.fetchMyGuests()
          .then((guests: Guest[]) => {
            const summary = {
              total: guests.length,
              yes: guests.filter(g => g.rsvp === "yes").length,
              no: guests.filter(g => g.rsvp === "no").length,
              maybe: guests.filter(g => g.rsvp === "maybe").length,
            };
            setGuestSummary(summary);
          })
          .catch((err) => {
            console.error("Could not load guests:", err);
    
          });
      });

    return (
    <div>
      <div className={styles.summaryContainer}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total Invited:</span>
              <span className={styles.summaryValue}>{guestSummary.total}</span>
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
