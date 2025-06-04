import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import TodoItem from "./ToDoItem";
import styles from "./TodoList.module.css";

export interface Todo {
  task: string;
  dueDate?: string;
  aiSent: boolean;
  priority?: "Low" | "Medium" | "High";
  done: boolean;
}

interface Props {
  sectionName: string;
  todos: Todo[];
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (idx: number) => void;
  onRunAI: (task: string) => void;
  onDelete: (idx: number) => void;
  onToggleDone: (idx: number, done: boolean) => void; // ✅ add this
}

const TodoSection: React.FC<Props> = ({
  sectionName,
  todos,
  isOpen,
  onToggle,
  onEdit,
  onRunAI,
  onDelete,
  onToggleDone
}) => (
  <div className={styles.todoSection}>
    <div className={styles.sectionHeader} onClick={onToggle}>
      {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      <h3 className={styles.sectionTitle}>{sectionName}</h3>
    </div>

    {isOpen && (
      <ul className={styles.todoList}>
        {todos.map((todo, i) => (
          
        <TodoItem
          key={i}
          todo={todo}
          onEdit={() => onEdit(i)}
          onRunAI={() => onRunAI(todo.task)}
          onDelete={() => onDelete(i)}
          onToggleDone={(done) => onToggleDone(i, done)} // ✅ pass done handler
        />
        ))}
      </ul>
    )}
  </div>
);

export default TodoSection;