import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import guestService, { Guest } from "../../services/guest-service";
import styles from "./WeddingDashboard.module.css";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4caf50', '#f44336', '#cfd8dc'];

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

  const pieData = [
    { name: 'Yes', value: guestSummary.yes },
    { name: 'No', value: guestSummary.no },
    { name: 'Maybe', value: guestSummary.maybe },
  ];

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
          <div className={styles.guestSummary} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p>Total: {guestSummary.total}</p>
              <p><span style={{ color: '#4caf50' }}>✅</span> Yes: {guestSummary.yes}</p>
              <p>❌ No: {guestSummary.no}</p>
              <p>❔ Maybe: {guestSummary.maybe}</p>
            </div>
            <div style={{ width: '50%', height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={45}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
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
