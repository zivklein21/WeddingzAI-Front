// src/components/TodoList/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from "./TodoList.module.css";
import tdlService from '../../services/tdl-service';

export interface TaskData {
  id?: string;
  text: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

interface AddProps {
  isOpen: boolean;
  onSave: (data: TaskData) => void;
  onCancel: () => void;
  sectionName: string;
}

interface EditProps {
  isOpen: boolean;
  onSave: (data: TaskData) => void;
  onCancel: () => void;
  sectionName: string;
  todoId: string;
  initial: TaskData;
}

// Add Task Modal
export const AddTaskModal: React.FC<AddProps> = ({ isOpen, onSave, onCancel }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskData['priority']>('Medium');

  const handleSave = async () => {
    onSave({ text, dueDate, priority });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} ariaHideApp={false} className={styles.modal} overlayClassName={styles.overlay}>
      <h2 className={styles.modalTitle}>Add New Task</h2>
      <div className={styles.modalBody}>
        <textarea className={styles.textareaInput} rows={4} placeholder="Task description" value={text} onChange={e => setText(e.target.value)} />
        <div className={styles.footerRow}>
          <input type="date" className={styles.controlInputSmall} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <select className={styles.controlInputSmall} value={priority} onChange={e => setPriority(e.target.value as TaskData['priority'])}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.saveBtn}>Save</button>
        </div>
      </div>
    </Modal>
  );
};

// Edit Task Modal
export const EditTaskModal: React.FC<EditProps> = ({ isOpen, onSave, onCancel, sectionName, todoId, initial }) => {
  const [text, setText] = useState(initial.text);
  const [dueDate, setDueDate] = useState(initial.dueDate || '');
  const [priority, setPriority] = useState<TaskData['priority']>(initial.priority || 'Medium');

  useEffect(() => {
    setText(initial.text);
    setDueDate(initial.dueDate || '');
    setPriority(initial.priority || 'Medium');
  }, [initial]);

  const handleSave = async () => {
    await tdlService.updateTask(sectionName, todoId, { task: text, dueDate, priority });
    onSave({ id: todoId, text, dueDate, priority });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} ariaHideApp={false} className={styles.modal} overlayClassName={styles.overlay}>
      <h2 className={styles.modalTitle}>Edit Task</h2>
      <div className={styles.modalBody}>
        <textarea className={styles.textareaInput} rows={4} placeholder="Task description" value={text} onChange={e => setText(e.target.value)} />
        <div className={styles.footerRow}>
          <input type="date" className={styles.controlInputSmall} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <select className={styles.controlInputSmall} value={priority} onChange={e => setPriority(e.target.value as TaskData['priority'])}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.saveBtn}>Save</button>
        </div>
      </div>
    </Modal>
  );
};