import React from "react";
import styles from "./TodoList.module.css";

interface Props {
  onClick: () => void;
}

const NewTaskButton: React.FC<Props> = ({ onClick }) => (
  <button className={styles.newTaskBtn} onClick={onClick}>
    + New Task
  </button>
);

export default NewTaskButton;