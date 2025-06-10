import React from 'react';
import Modal from 'react-modal';
import styles from './Calendar.module.css'; 
import * as Icons from "../../icons/index.ts";

interface Props {
  isOpen: boolean;
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({
  isOpen,
  eventTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      ariaHideApp={false}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.modalTitle}>Delete Event?</h2>
      <p>Are you sure you want to delete:</p>
      <blockquote>{eventTitle}</blockquote>
      <div className={styles.buttons}>
        <span onClick={onCancel} className="icon">
          <Icons.CloseIcon title="Cancle Delete"/>
        </span>
        <span onClick={onConfirm} className="icon">
          <Icons.DeleteIcon  title='Delete Event'/>
        </span>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;