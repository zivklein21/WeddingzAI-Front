import React, { useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import {
  Facebook,
  Instagram,
  Globe,
  X,
} from 'lucide-react';
import styles from './dj-details.module.css';

Modal.setAppElement('#root');

export interface BrideReview {
  reviewer: string;
  date:     string;
  comment:  string;
}

export interface Faq {
  question: string;
  answer:   string;
}

export interface Dj {
  _id:          string;
  name:         string;
  rating?:      number;
  coverImage?:  string;
  profileImage: string;
  about?:       string;
  price_range?: string;
  services?:    string;
  area?:        string;
  hour_limits?: string;
  genres?:      string;
  eventImages?: string[];
  faqs?:        Faq[];
  brideReviews?:BrideReview[];
  socialMedia?: {
    facebook?:  string;
    instagram?: string;
    website?:   string;
  };
  sourceUrl?:   string;
}

interface Props {
  dj:      Dj;
  isOpen:  boolean;
  onClose: () => void;
}

const DjDetailModal: React.FC<Props> = ({ dj, isOpen, onClose }) => {
  const [openFaq, setOpenFaq]               = useState<number|null>(null);
  const [expandedReview, setExpandedReview] = useState<number|null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // scroll to top whenever opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Presence checks
  const has = {
    about:    !!dj.about?.trim(),
    details:  dj.price_range || dj.services || dj.area || dj.hour_limits || dj.genres,
    photos:   Array.isArray(dj.eventImages) && dj.eventImages.length > 0,
    faqs:     Array.isArray(dj.faqs)        && dj.faqs!.length > 0,
    reviews:  Array.isArray(dj.brideReviews)&& dj.brideReviews!.length > 0,
    contact:  !!(dj.socialMedia?.facebook || dj.socialMedia?.instagram || dj.socialMedia?.website),
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} />
      </button>

      <header className={styles.header}>
        {dj.profileImage && (
          <img
            className={styles.avatar}
            src={dj.profileImage}
            alt={dj.name}
          />
        )}
        <h1 className={styles.title}>{dj.name}</h1>
      </header>

      <nav className={styles.nav}>
        {has.about   && <button onClick={() => scrollTo('about')}>About</button>}
        {has.details && <button onClick={() => scrollTo('details')}>Details</button>}
        {has.photos  && <button onClick={() => scrollTo('photos')}>Photos</button>}
        {has.faqs    && <button onClick={() => scrollTo('faqs')}>FAQs</button>}
        {has.reviews && <button onClick={() => scrollTo('reviews')}>Bride’s Words</button>}
        {has.contact && <button onClick={() => scrollTo('contact')}>Contact</button>}
      </nav>

      <div className={styles.content} ref={contentRef}>

        {has.about && (
          <section id="about" className={styles.section}>
            <h2>About</h2>
            <p>{dj.about}</p>
          </section>
        )}

        {has.details && (
          <section id="details" className={styles.section}>
            <h2>Details</h2>
            <ul>
              {dj.price_range && (
                <li><strong>price range:</strong> {dj.price_range}</li>
              )}
              {dj.services && (
                <li><strong>services:</strong> {dj.services}</li>
              )}
              {dj.area && (
                <li><strong>area:</strong> {dj.area}</li>
              )}
              {dj.hour_limits && (
                <li><strong>hour limits:</strong> {dj.hour_limits}</li>
              )}
              {dj.genres && (
                <li><strong>genres:</strong> {dj.genres}</li>
              )}
            </ul>
          </section>
        )}

        {has.photos && (
          <section id="photos" className={styles.section}>
            <h2>Photos</h2>
            <div className={styles.photosGrid}>
              {dj.eventImages!.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Event photo ${i+1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}

        {has.faqs && (
          <section id="faqs" className={styles.section}>
            <h2>FAQs</h2>
            {dj.faqs!.map((f, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className={styles.toggle}>
                    {openFaq === i ? '–' : '+'}
                  </span>
                  {f.question}
                </button>
                {openFaq === i && (
                  <p className={styles.faqAnswer}>{f.answer}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {has.reviews && (
          <section id="reviews" className={styles.section}>
            <h2>Bride’s Words</h2>
            <div className={styles.reviewsGrid}>
              {dj.brideReviews!.map((r, i) => {
                const isExpanded = expandedReview === i;
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
                        onClick={() => setExpandedReview(isExpanded ? null : i)}
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {has.contact && (
          <section id="contact" className={styles.section}>
            <h2>Contact</h2>
            <div className={styles.contactIcons}>
              {dj.socialMedia?.facebook && (
                <a href={dj.socialMedia.facebook} target="_blank" rel="noreferrer">
                  <Facebook size={24} />
                </a>
              )}
              {dj.socialMedia?.instagram && (
                <a href={dj.socialMedia.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={24} />
                </a>
              )}
              {dj.socialMedia?.website && (
                <a href={dj.socialMedia.website} target="_blank" rel="noreferrer">
                  <Globe size={24} />
                </a>
              )}
            </div>
          </section>
        )}

      </div>
    </Modal>
  );
};

export default DjDetailModal;