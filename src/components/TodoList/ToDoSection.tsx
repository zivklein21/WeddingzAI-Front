// src/components/TodoList/ToDoSection.tsx
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import TodoItem from "./ToDoItem";
import NewTaskButton from "./NewTaskButton";
import styles from "./TodoList.module.css";

export interface Todo {
  task: string;
  dueDate?: string;
  aiSent: boolean;
  priority?: "Low" | "Medium" | "High";
  done: boolean;
  deleted?: boolean; // for soft delete
}

interface Props {
  sectionName: string;
  todos: Todo[];
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (idx: number) => void;
  onRunAI: (task: string) => void;
  onDelete: (idx: number) => void;
  onNewTask: () => void;
  onToggleDone: (idx: number, done: boolean) => void;
}

const TodoSection: React.FC<Props> = ({
  sectionName,
  todos,
  isOpen,
  onToggle,
  onEdit,
  onRunAI,
  onDelete,
  onNewTask,
  onToggleDone,
}) => (
  <div className={styles.todoSection}>
    <div className={styles.sectionHeader} onClick={onToggle}>
      {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      <h3 className={styles.sectionTitle}>{sectionName}</h3>
    </div>

    {isOpen && (
      <ul className={styles.todoList}>
        {todos.map((todo, i) => {
          const originalIndex = todos.findIndex(t => t === todo); // preserve original position
          return (
            <TodoItem
              key={i}
              todo={todo}
              onEdit={() => onEdit(originalIndex)}
              onRunAI={() => onRunAI(todo.task)}
              onDelete={() => onDelete(originalIndex)}
              onToggleDone={(done) => onToggleDone(originalIndex, done)}
            />
          );
        })}
        <li>
          <NewTaskButton onClick={onNewTask} />
        </li>
      </ul>
    )}
  </div>
);

export default TodoSection;
