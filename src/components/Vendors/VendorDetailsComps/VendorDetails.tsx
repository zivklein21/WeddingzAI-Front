import React, { useRef, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';

Modal.setAppElement('#root');

interface Props {
  vendor:       Vendor;
  isOpen:       boolean;
}

const VendorDetails: React.FC<Props> = ({ vendor, isOpen }) => {
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
          <section id="details" className={styles.section}>
            <h2>Details</h2>
            <ul>
              {vendor.price_range && (
                <li><strong>price range:</strong> {vendor.price_range}</li>
              )}
              {vendor.services && (
                <li><strong>services:</strong> {vendor.services}</li>
              )}
              {vendor.area && (
                <li><strong>area:</strong> {vendor.area}</li>
              )}
              {vendor.hour_limits && (
                <li><strong>hour limits:</strong> {vendor.hour_limits}</li>
              )}
              {vendor.genres && (
                <li><strong>genres:</strong> {vendor.genres}</li>
              )}
              {vendor.end_time && (
                <li><strong>end time:</strong> {vendor.end_time}</li>
              )}
              {vendor.max_companions && (
                <li><strong>max companions:</strong> {vendor.max_companions}</li>
              )}
              {vendor.min_guests && (
                <li><strong>min guests:</strong> {vendor.min_guests}</li>
              )}
              {vendor.max_guests && (
                <li><strong>max guests:</strong> {vendor.max_guests}</li>
              )}
              {vendor.price_include && (
                <li><strong>price include:</strong> {vendor.price_include}</li>
              )}
              {vendor.seasons && (
                <li><strong>seasons:</strong> {vendor.seasons}</li>
              )}
            </ul>
          </section>
      </div>
    </>
  );
};

export default VendorDetails;