// src/components/WeddingDashboard/WeddingDashboard.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import styles from "./WeddingDashboard.module.css";

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
        // Optionally redirect:
        // navigate("/");
      });
  }, [navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.budget}`}>
          Budget Overview
          <hr className={styles.divider} />
        </div>

        <Link to="/guests" className={`${styles.card} ${styles.guests}`}>
          Guest List
          <hr className={styles.divider} />
        </Link>

        <div className={`${styles.card} ${styles.seating}`}>
          Seating Chart
          <hr className={styles.divider} />
        </div>

        <div className={`${styles.card} ${styles.calendar}`}>
          Calendar
          <hr className={styles.divider} />
        </div>

        <div className={`${styles.card} ${styles.menu}`}>
          Menu
          <hr className={styles.divider} />
        </div>

        {/* ✅ Entire To-Do List card is now clickable */}
        <Link to="/todolist" className={`${styles.card} ${styles.todo}`}>
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
        </Link>

        <div className={`${styles.card} ${styles.vendors}`}>
          Vendors
          <hr className={styles.divider} />
        </div>

        <div className={`${styles.card} ${styles.view3d}`}>
          Details matter
          <hr className={styles.divider} />
        </div>

        <div className={`${styles.card} ${styles.invitation}`}>
          Invitation
          <hr className={styles.divider} />
        </div>
      </div>
    </div>
  );
}
