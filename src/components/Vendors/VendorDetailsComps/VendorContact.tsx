import React, { useRef } from 'react';
import Modal from 'react-modal';
import {
  Facebook,
  Instagram,
  Globe,
} from 'lucide-react';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';

Modal.setAppElement('#root');

interface Props {
  vendor:      Vendor;
}

const VendorContact: React.FC<Props> = ({ vendor }) => {
  const contentRef = useRef<HTMLDivElement>(null);


  return (
      <div className={styles.content} ref={contentRef}>
          <section id="contact" className={styles.section}>
            <h2>Contact</h2>
            <div className={styles.contactIcons}>
              {vendor.socialMedia?.facebook && (
                <a href={vendor.socialMedia.facebook} target="_blank" rel="noreferrer">
                  <Facebook size={24} />
                </a>
              )}
              {vendor.socialMedia?.instagram && (
                <a href={vendor.socialMedia.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={24} />
                </a>
              )}
              {vendor.website && (
                <a href={vendor.website} target="_blank" rel="noreferrer">
                  <Globe size={24} />
                </a>
              )}
            </div>
          </section>
      </div>
  );
};

export default VendorContact;