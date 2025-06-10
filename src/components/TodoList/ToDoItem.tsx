import React from "react";
import styles from "./TodoList.module.css";
import { Todo } from "./ToDoSection";
import * as Icons from "../../icons/index";

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
          <span onClick={onEdit}>
            <Icons.EditIocn className="icon" title="Edit Task" />
          </span>

          <span
            onClick={onRunAI}
            aria-label="Run AI"
            style={aiSent ? { color: "green", cursor: "not-allowed" } : undefined}
            
          >
            <Icons.AiIcon className="icon" title={aiSent ? "Already processed" : "Run AI"} />
          </span>

          <span onClick={onDelete} aria-label="Delete">
            <Icons.DeleteIcon title="Delete Task" className="icon"/>
          </span>
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