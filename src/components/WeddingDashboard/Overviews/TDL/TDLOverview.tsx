import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tdlService from "../../../../services/tdl-service";
import styles from "./TDLOverview.module.css"; 
import * as Icons from "../../../../icons/index";

const TDLOverview = () => {
  const [previewTasks, setPreviewTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const tdl = await tdlService.fetchMyTdl();
        const allTasks = tdl.sections.flatMap((sec) =>
          sec.todos.map((todo) => todo.task)
        );
        setPreviewTasks(allTasks.slice(0, 3));
      } catch (err) {
        console.error("Could not load TDL preview:", err);
        setError("Failed to load TDL preview.");
        setPreviewTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Icons.LoaderIcon className="spinner"/>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}><Icons.ErrorIcon className="errorIcon"/></div>;
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
        <p className={styles.todoPreviewEmpty}>No tasks found.</p>
      )}
    </>
  );
};

export default TDLOverview;