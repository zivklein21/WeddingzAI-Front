// src/components/TodoList/TodoList.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import styles from "./TodoList.module.css";

export default function TodoList() {
  const [todoList, setTodoList] = useState<TdlData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    tdlService
      .fetchMyTdl()
      .then((list) => {
        setTodoList(list);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Could not load your to-do list.");
        // if you want to redirect when nothing found:
        // navigate("/");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p className={styles.loading}>Loading to-do list…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!todoList)
    return <p className={styles.noTasks}>No to-do list found. Please create one.</p>;

  return (
    <div className={styles.wrapper}>
      {todoList ? (
        <div className={styles.todoListContainer}>
          <h2 className={styles.todoTitle}>{todoList.weddingTodoListName}</h2>
          <p className={styles.coupleNames}>
            👰 {todoList.bride} & 🤵 {todoList.groom}
          </p>
          <p className={styles.weddingDate}>
            📅 Wedding Date: <strong>{todoList.weddingDate}</strong>
          </p>

          {todoList.sections.length > 0 ? (
            todoList.sections.map((section, index) => (
              <div key={index} className={styles.todoSection}>
                <h3 className={styles.sectionTitle}>{section.sectionName}</h3>
                <ul className={styles.todoList}>
                  {section.todos.map((todo, i) => (
                    <li key={i} className={styles.todoItem}>
                      <div className={styles.taskRow}>
                        <input type="checkbox" className={styles.checkbox} />
                        <div className={styles.taskInfo}>
                          <strong className={styles.taskTitle}>
                            {todo.task}
                          </strong>
                          <span
                            className={`${styles.priority} ${
                              styles[`priority${todo.priority}`]
                            }`}
                          >
                            {todo.priority}
                          </span>
                        </div>
                        <span className={styles.dueDate}>
                          📅 {todo.dueDate}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className={styles.noTasks}>No tasks found.</p>
          )}
        </div>
      ) : (
        <p className={styles.loading}>Loading to-do list...</p>
      )}
    </div>
  );
}