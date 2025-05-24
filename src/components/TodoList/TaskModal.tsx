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

interface Props {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initial?: TaskData;
  onSave: (data: TaskData) => void;
  onCancel: () => void;
  sectionName: string;
  index?: number;
}

export const TaskModal: React.FC<Props> = ({
  isOpen, mode, initial, onSave, onCancel, sectionName, index
}) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskData['priority']>('Medium');

  useEffect(() => {
    if (initial) {
      setText(initial.text);
      setDueDate(initial.dueDate || '');
      setPriority(initial.priority || 'Medium');
    } else {
      setText('');
      setDueDate('');
      setPriority('Medium');
    }
  }, [initial, isOpen]);

  const handleSave = async () => {
    if (mode === 'add') {
      await tdlService.addTask(sectionName, text, dueDate, priority);
    } else {
      await tdlService.updateTask(
        sectionName,
        index ?? 0,
        { task: text, dueDate, priority }
      );
    }
    // still call onSave so parent can close modal / reload list
    onSave({ id: initial?.id, text, dueDate, priority });
  };



  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      ariaHideApp={false}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.modalTitle}>
        {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div className={styles.modalBody}>
        <textarea
          className={styles.textareaInput}
          rows={4}
          placeholder="Task description"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <div className={styles.footerRow}>
          <input
            type="date"
            className={styles.controlInputSmall}
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <select
            className={styles.controlInputSmall}
            value={priority}
            onChange={e => setPriority(e.target.value as TaskData['priority'])}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};