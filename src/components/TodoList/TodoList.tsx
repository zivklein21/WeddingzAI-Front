// src/components/TodoList/TodoList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import vendorService from "../../services/vendor-service";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Activity,
  Trash2,
} from "lucide-react";
import styles from "./TodoList.module.css";

export default function TodoList() {
  const [todoList, setTodoList] = useState<TdlData | null>(null);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


const handleAIButtonClick = async (task: string) => {
  try {
    await vendorService.startAIResearchBackground(task);
    
    alert(`המחקר על "${task}" החל לרוץ ברקע! התוצאות יופיעו בדף הספקים.`);
  } catch (err) {
    console.error("Error starting AI research:", err);
    alert("אירעה שגיאה בהפעלת המחקר. אנא נסה שוב מאוחר יותר.");
  }
};

  useEffect(() => {
    tdlService
      .fetchMyTdl()
      .then((list) => {
        setTodoList(list);
        const init: Record<number, boolean> = {};
        list.sections.forEach((_, idx) => (init[idx] = true));
        setOpenSections(init);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Could not load your to-do list.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) return <p className={styles.loading}>Loading to-do list…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!todoList)
    return (
      <p className={styles.noTasks}>
        No to-do list found. Please create one.
      </p>
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.todoListContainer}>
        <h2 className={styles.todoTitle}>
          {todoList.weddingTodoListName}
        </h2>
        <p className={styles.coupleNames}>
           💍 {todoList.firstPartner} &  {todoList.secondPartner}
        </p>
        <p className={styles.weddingDate}>
          📅 Wedding Date: <strong>{todoList.weddingDate}</strong>
        </p>

        {todoList.sections.map((section, idx) => (
          <div key={idx} className={styles.todoSection}>
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection(idx)}
            >
              {openSections[idx] ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
              <h3 className={styles.sectionTitle}>{section.sectionName}</h3>
            </div>

            {openSections[idx] && (
              <ul className={styles.todoList}>
                {section.todos.map((todo, i) => (
                  <li key={i} className={styles.todoItem}>
                    <div className={styles.taskRow}>
                      <span className={styles.taskTitle}>{todo.task}</span>
                      <div className={styles.actions}>  
                        <button type="button" className={styles.infoBtn} aria-label="Info">
                          <Info size={16} />
                        </button>
                        <button 
                          type="button" 
                          className={styles.aiBtn} 
                          aria-label="Run AI" 
                          onClick={() => handleAIButtonClick(todo.task)}
                        > 
                          <Activity size={16} />
                        </button>
                        <button type="button" className={styles.deleteBtn} aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                    </div>
                      <input
                        type="checkbox"
                        className={styles.statusCheckbox}
                        onChange={() => {
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button className={styles.newTaskBtn}>+ New Task</button>
          </div>
        ))}
      </div>
    </div>
    
  );
}