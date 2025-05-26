import Modal from 'react-modal';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';
import { X } from 'lucide-react';
Modal.setAppElement('#root');


interface Props {
  vendor:      Vendor;
  onClose: () => void;
}

const VendorHeader: React.FC<Props> = ({ vendor, onClose }) => {

  return (
    <>
      <header className={styles.header}>
        {vendor.profileImage && (
          <img
            className={styles.avatar}
            src={vendor.profileImage}
            alt={vendor.name}
          />
        )}
        <h1 className={styles.title}>{vendor.name}</h1>
        <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} />
      </button>
      </header>

    </>
  );
};

export default VendorHeader;