import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tdlService from "../../../../services/tdl-service";
import styles from "./TDLOverview.module.css"; 
import {FiLoader} from 'react-icons/fi';

const TDLOverview = () => {
  const [previewTasks, setPreviewTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    tdlService
      .fetchMyTdl()
      .then((tdl) => {
        const allTasks = tdl.sections.flatMap((sec) =>
          sec.todos.map((todo) => todo.task)
        );
        setPreviewTasks(allTasks.slice(0, 3));
      })
      .catch((err) => {
        console.error("Could not load TDL preview:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <FiLoader className={styles.spinner} />
      </div>
    );
  }

  return (
    <>
      {previewTasks.length > 0 ? (
        <ul className={styles.todoPreview}>
          {previewTasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.todoPreviewEmpty}>Loading…</p>
      )}
    </>
  );
};

export default TDLOverview;