import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import styles from "./WeddingDashboard.module.css";

// Components
import BudgetOverview from "../Overviews/Budget/BudgetOverview";
import GuestListOverview from "../Overviews/GuestList/GuestListOverview";


export default function WeddingDashboard() {
  const [previewTasks, setPreviewTasks] = useState<string[]>([]);
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

 
  }, [navigate]);


  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.budget}`}>
          Budget Overview
          <hr className={styles.divider} />
          <BudgetOverview/>
          <Link to="/budget">
            <div className={styles.manageLink}>Manage Budget</div>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.guests}`}>
          Guests List
          <hr className={styles.divider} />
          <GuestListOverview/>
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
