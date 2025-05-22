import React, { useRef } from 'react';
import styles from '../vendors.module.css';
import { BrideReview } from '../../../types/Vendor';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
interface Props {
  reviews: BrideReview[];
  expanded: number | null;
  setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
}

const VendorReviews: React.FC<Props> = ({ reviews, expanded, setExpanded }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const showArrows = reviews.length > 3;

  return (
    <div className={styles.content}>
      <section id="reviews" className={styles.section}>
        <h2>Bride’s Words</h2>
        <div className={styles.scrollWrapper}>
          {showArrows && <button onClick={() => scroll('left')} className={styles.arrow}><FiArrowLeft/></button>}
          <div className={styles.reviewsScroll} ref={scrollRef}>
            {reviews.map((r, i) => {
              const isExpanded = expanded === i;
              return (
                <div key={i} className={styles.reviewCard}>
                  <h3>{r.reviewer}</h3>
                  <small className={styles.reviewDate}>{r.date}</small>
                  <p className={`${styles.reviewText} ${isExpanded ? styles.expanded : ''}`}>
                    {r.comment}
                  </p>
                  {r.comment.length > 150 && (
                    <button
                      className={styles.readMore}
                      onClick={() => setExpanded(isExpanded ? null : i)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {showArrows && <button onClick={() => scroll('right')} className={styles.arrow}><FiArrowRight/></button>}
        </div>
      </section>
    </div>
  );
};

export default VendorReviews;