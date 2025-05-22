import React, { useRef, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';

Modal.setAppElement('#root');



interface Props {
  vendor:      Vendor;
  isOpen:  boolean;
}

const VendorAbout: React.FC<Props> = ({ vendor, isOpen }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // scroll to top whenever opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <>
      <div className={styles.content} ref={contentRef}>
          <section id="about" className={styles.section}>
            <h2>About</h2>
            <p>{vendor.about}</p>
          </section>
      </div>
    </>
  );
};

export default VendorAbout;