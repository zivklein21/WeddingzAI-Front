// src/components/WeddingDashboard/WeddingDashboard.tsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import styles from "./WeddingDashboard.module.css";
import BudgetChart from "../Budget/BudgetChart";

export default function WeddingDashboard() {
  const [previewTasks, setPreviewTasks] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    tdlService
      .fetchMyTdl()
      .then((tdl: TdlData) => {
        // Flatten all tasks across all sections, then take first 3
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
          <h3 className={styles.cardTitle}>Budget Overview</h3>
          <hr className={styles.divider} />
          <BudgetChart
             size={140}
             strokeWidth={16}
           />
        </div>
        <div className={`${styles.card} ${styles.guests}`}>
          <h3 className={styles.cardTitle}>Guest List</h3>
          <hr className={styles.divider} />
        </div>
        <div className={`${styles.card} ${styles.seating}`}>
          <h3 className={styles.cardTitle}>Seating Chart</h3>
          <hr className={styles.divider} />
        </div>
        <div className={`${styles.card} ${styles.calendar}`}>
          <h3 className={styles.cardTitle}>Calendar</h3>
          <hr className={styles.divider} />
        </div>
        <div className={`${styles.card} ${styles.menu}`}>
          <h3 className={styles.cardTitle}>Menu</h3>
          <hr className={styles.divider} />
        </div>

        <div className={`${styles.card} ${styles.todo}`}>
          <h3 className={styles.cardTitle}>To Do List</h3>
          <hr className={styles.divider} />
          <Link to="/todolist" className={styles.todoLink}>
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
        </div>

        <div className={`${styles.card} ${styles.vendors}`}>
          <h3 className={styles.cardTitle}>Vendors</h3>
          <hr className={styles.divider} />
        </div>
        <div className={`${styles.card} ${styles.view3d}`}>
          <h3 className={styles.cardTitle}>Details matter</h3>
          <hr className={styles.divider} />
        </div>
        <div className={`${styles.card} ${styles.invitation}`}>
          <h3 className={styles.cardTitle}>Invitation</h3>
          <hr className={styles.divider} />
        </div>
      </div>
    </div>
  );
}