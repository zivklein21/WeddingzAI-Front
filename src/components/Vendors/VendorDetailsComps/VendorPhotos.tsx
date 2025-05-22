import React, { useRef } from 'react';
import Modal from 'react-modal';
import styles from '../vendors.module.css';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

Modal.setAppElement('#root');

interface Props {
  images: string[];
}

const VendorDetails: React.FC<Props> = ({ images }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const showArrows = images.length > 5;

  return (
    <div className={styles.content}>
      <section id="photos" className={styles.section}>
        <h2>Photos</h2>
        <div className={styles.scrollWrapper}>
          {showArrows && (
            <button onClick={() => scroll('left')} className={styles.arrow}>
              <FiArrowLeft />
            </button>
          )}
          <div className={styles.photoScrollGrid} ref={scrollRef}>
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Event photo ${i + 1}`}
                loading="lazy"
                className={styles.photoItem}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ))}
          </div>
          {showArrows && (
            <button onClick={() => scroll('right')} className={styles.arrow}>
              <FiArrowRight />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default VendorDetails;