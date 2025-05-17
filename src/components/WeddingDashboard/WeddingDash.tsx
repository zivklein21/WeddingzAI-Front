import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import guestService, { Guest } from "../../services/guest-service";
import styles from "./WeddingDashboard.module.css";


export default function WeddingDashboard() {
  const [previewTasks, setPreviewTasks] = useState<string[]>([]);
  const [guestSummary, setGuestSummary] = useState({
    total: 0,
    yes: 0,
    no: 0,
    maybe: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    tdlService
      .fetchMyTdl()
      .then((tdl: TdlData) => {
        const allTasks = tdl.sections.flatMap((sec) =>
          sec.todos.map((todo) => todo.task)
        );
        setPreviewTasks(allTasks.slice(0, 3));
      })
      .catch((err) => {
        console.error("Could not load TDL preview:", err);

      });

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
  }, [navigate]);


  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.budget}`}>
          Budget Overview
          <hr className={styles.divider} />
          <Link to="/budget">
            <div className={styles.manageLink}>Manage Budget</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.guests}`}>
          Guests List
          <hr className={styles.divider} />

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
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Guests</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.seating}`}>
          Seating Chart
          <hr className={styles.divider} />
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Seats</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.calendar}`}>
          Calendar
          <hr className={styles.divider} />
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Calendar</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.menu}`}>
          Menu
          <hr className={styles.divider} />
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Menu</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.todo}`}>
          To-Do List
          <hr className={styles.divider} />
          {previewTasks.length > 0 ? (
            <ul className={styles.todoPreview}>
              {previewTasks.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.todoPreviewEmpty}>Loading…</p>
          )}
          <Link to="/todolist">
            <div className={styles.manageLink}>Manage TDL</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.vendors}`}>
          Vendors
          <hr className={styles.divider} />
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Vendors</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.view3d}`}>
          Details matter
          <hr className={styles.divider} />
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Details</div>
          </Link>
        </div>


        <div className={`${styles.card} ${styles.invitation}`}>
          Invitation
          <hr className={styles.divider} />
          <Link to="/guests">
            <div className={styles.manageLink}>Manage Vendors</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
