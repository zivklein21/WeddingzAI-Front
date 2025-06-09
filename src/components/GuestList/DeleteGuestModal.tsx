import React from 'react';
import Modal from 'react-modal';
import styles from './GuestList.module.css';

interface Props {
  isOpen: boolean;
  guestName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmGuestDeleteModal: React.FC<Props> = ({
  isOpen,
  guestName,
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
      <h2 className={styles.modalTitle}>Delete Guest?</h2>
      <p>Are you sure you want to delete the following guest?</p>
      <blockquote>{guestName}</blockquote>
      <div className={styles.buttons}>
        <button onClick={onCancel} className={styles.cancleBtn}>Cancel</button>
        <button onClick={onConfirm} className={styles.cancleBtn}>Delete</button>
      </div>
    </Modal>
  );
};
