import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { DiIllustrator } from "react-icons/di";
import styles from "./TodoList.module.css";
import { Todo } from "./ToDoSection";

interface Props {
  todo: Todo & { priority?: "Low" | "Medium" | "High" };
  onEdit: () => void;
  onRunAI: () => void;
  onDelete: () => void;
  onToggleDone: (done: boolean) => void; // new prop
}

const PRIORITY_COLOR: Record<"Low" | "Medium" | "High", string> = {
  High: "#f8afaf",
  Medium: "#f8e89e",
  Low: "#a5e5b5",
};

const TodoItem: React.FC<Props> = ({ todo, onEdit, onRunAI, onDelete, onToggleDone }) => {
  const { aiSent, done } = todo;
  const color = todo.priority ? PRIORITY_COLOR[todo.priority] : "transparent";

  return (
    <li className={styles.todoItem}>
      <div className={styles.dateRow}>
        <span className={styles.taskDate}>{todo.dueDate}</span>
      </div>

      <div className={styles.taskRow} style={{ borderLeftColor: color }}>
        <span className={styles.taskTitle}>{todo.task}</span>

        <div className={styles.actions}>
          <button onClick={onEdit} className={styles.editBtn} aria-label="Edit">
            <FiEdit2 size={20} />
          </button>

          <button
            onClick={onRunAI}
            className={styles.aiBtn}
            aria-label="Run AI"
            disabled={aiSent}
            style={aiSent ? { color: "green", cursor: "not-allowed" } : undefined}
            title={aiSent ? "Already processed" : "Run AI"}
          >
            <DiIllustrator size={20} />
          </button>

          <button onClick={onDelete} className={styles.deleteBtn} aria-label="Delete">
            <FiTrash2 size={20} />
          </button>
        </div>

        <input
          type="checkbox"
          className={styles.statusCheckbox}
          checked={done}
          onChange={(e) => onToggleDone(e.target.checked)}
          title="Mark as done"
        />
      </div>
    </li>
  );
};

export default TodoItem;