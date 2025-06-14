// ConfirmDeleteModal.tsx
import React from 'react'
import Modal from 'react-modal'
import styles from "./TodoList.module.css";
import tdlService from '../../services/tdl-service';
import * as Icons from "../../icons/index";

interface Props {
  isOpen: boolean
  taskText: string
  onConfirm: () => void
  onCancel: () => void
  sectionName: string;
  index: number;
}

export const ConfirmDeleteModal: React.FC<Props> = ({
  isOpen, taskText, onConfirm, onCancel, sectionName, index
}) => {
  const handleConfirm = async () => {
    try{
      await tdlService.deleteTask(sectionName, index);
      onConfirm();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

return(
  <Modal
    isOpen={isOpen}
    onRequestClose={onCancel}
    ariaHideApp={false}
    className={styles.modal}
    overlayClassName={styles.overlay}
  >
    <h2 className={styles.modalTitle}>Delete Task?</h2>
    <p>Are you sure you want to delete:</p>
    <blockquote>{taskText}</blockquote>
    <div className={styles.buttons}>
      <span onClick={onCancel} className="icon"><Icons.CloseIcon title='Close Task'/></span>
      <span onClick={handleConfirm} className="icon"><Icons.DeleteIcon title='Delete Task'/></span>
    </div>
  </Modal>
)};