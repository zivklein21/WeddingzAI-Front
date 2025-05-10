// src/components/DjDetail/DjDetailAnchored.tsx

import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './dj-details.module.css';
import { X } from 'lucide-react';

export interface Review { reviewer: string; rating: number; comment: string }
export interface Faq    { question: string; answer: string }

export interface Dj {
  name: string;
  rating?: number;
  coverImage?: string;
  profileImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  location?: string;
  priceRange?: string;
  about?: string;
  eventImages?: string[];
  reviews?: Review[];
  faqs?: Faq[];
}

export interface DjDetailProps { dj: Dj; onClose: () => void }

const SECTIONS = [
  { id: 'about',   label: 'About',    predicate: (dj: Dj) => !!dj.about },
  { id: 'contact', label: 'Contact',  predicate: (dj: Dj) => !!(dj.location || dj.facebookUrl || dj.instagramUrl) },
  { id: 'details', label: 'Details',  predicate: (dj: Dj) => !!dj.location /* or other detail fields */ },
  { id: 'photos',  label: 'Photos',   predicate: (dj: Dj) => (dj.eventImages?.length ?? 0) > 0 },
  { id: 'pricing', label: 'Pricing',  predicate: (dj: Dj) => !!dj.priceRange },
  { id: 'faqs',    label: 'FAQs',     predicate: (dj: Dj) => (dj.faqs?.length ?? 0) > 0 },
  { id: 'reviews', label: 'Reviews',  predicate: (dj: Dj) => (dj.reviews?.length ?? 0) > 0 },
];

Modal.setAppElement('#root');

const DjDetailAnchored: React.FC<DjDetailProps> = ({ dj, onClose }) => {
  const [lightboxSrc, setLightboxSrc] = useState<string|null>(null);
  const [openFaq, setOpenFaq]         = useState<number|null>(null);
  const [expandedReview, setExpandedReview] = useState<number|null>(null);

  const BEX     = import.meta.env.VITE_BACKEND_URL || '';
  const rawPath = dj.coverImage ?? dj.profileImage ?? '';
  const coverUrl = rawPath.startsWith('http') ? rawPath : `${BEX}${rawPath}`;

  // filter nav for only sections with data
  const navSections = SECTIONS.filter(s => s.predicate(dj));

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.container} onClick={e=>e.stopPropagation()}>
          <button className={styles.close} onClick={onClose}><X size={24}/></button>

          {/* Cover + Name */}
          {rawPath && (
            <div className={styles.coverWrapper}>
              <div
                className={styles.cover}
                style={{ backgroundImage: `url(${coverUrl})` }}
              />
              <div className={styles.nameOverlay}>
                <h1 className={styles.djName}>{dj.name}</h1>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className={styles.nav}>
            {navSections.map(s => (
              <a key={s.id} href={`#${s.id}`} className={styles.navLink}>
                {s.label}
              </a>
            ))}
          </nav>

          <div className={styles.sections}>
            {/* About */}
            {dj.about && (
              <section id="about" className={styles.row}>
                <div className={styles.colAbout}>
                  <h2>About</h2>
                  <p>{dj.about}</p>
                </div>
                {/* Contact rendered below if data exists */}
                { (dj.location || dj.facebookUrl || dj.instagramUrl) && (
                  <div className={styles.colContact}>
                    <h2>Contact</h2>
                    {dj.location    && <p>📍 {dj.location}</p>}
                    {dj.facebookUrl && <p>🔗 <a href={dj.facebookUrl}>Facebook</a></p>}
                    {dj.instagramUrl&& <p>🔗 <a href={dj.instagramUrl}>Instagram</a></p>}
                  </div>
                )}
              </section>
            )}

            {/* Details & Pricing */}
            {(dj.location || dj.priceRange) && (
              <section id="details" className={styles.row}>
                {dj.location && (
                  <div className={styles.colAbout}>
                    <h2>Details</h2>
                    <ul>
                      <li>Location: {dj.location}</li>
                    </ul>
                  </div>
                )}
                {dj.priceRange && (
                  <div className={styles.colContact}>
                    <h2>Pricing</h2>
                    <p>{dj.priceRange}</p>
                  </div>
                )}
              </section>
            )}

            {/* Photos */}
            {dj.eventImages && dj.eventImages.length > 0 && (
              <section id="photos">
                <h2>Photos</h2>
                <div className={styles.photoGrid}>
                  {dj.eventImages.map((src,i)=> {
                    const url = src.startsWith('http') ? src : `${BEX}${src}`;
                    return (
                      <img
                        key={i}
                        src={url}
                        alt={`Photo ${i+1}`}
                        onClick={()=>setLightboxSrc(url)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* FAQs */}
            {dj.faqs && dj.faqs.length > 0 && (
              <section id="faqs">
                <h2>FAQs</h2>
                <div className={styles.faqs}>
                  {dj.faqs.map((f,i)=>(
                    <div key={i} className={styles.faq}>
                      <button
                        className={styles.faqQ}
                        onClick={()=>setOpenFaq(openFaq===i?null:i)}
                      >
                        {f.question}
                      </button>
                      {openFaq===i && <p className={styles.faqA}>{f.answer}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {dj.reviews && dj.reviews.length > 0 && (
              <section id="reviews">
                <h2>Reviews</h2>
                <div className={styles.reviews}>
                  {dj.reviews.map((r,i)=> {
                    const isExpanded = expandedReview===i;
                    const snippet = isExpanded
                      ? r.comment
                      : r.comment.slice(0,150) + (r.comment.length>150?'…':'');
                    return (
                      <div key={i} className={styles.reviewCard}>
                        <p className={styles.reviewHeader}>
                          <strong>{r.reviewer}</strong> — {r.rating}/5
                        </p>
                        <p className={styles.reviewBody}>{snippet}</p>
                        {r.comment.length>150 && (
                          <button
                            className={styles.readMore}
                            onClick={()=>setExpandedReview(isExpanded?null:i)}
                          >
                            {isExpanded?'Show less':'Read more'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Modal
        isOpen={!!lightboxSrc}
        onRequestClose={()=>setLightboxSrc(null)}
        className={styles.lightbox}
        overlayClassName={styles.lightboxOverlay}
      >
        {lightboxSrc && <img src={lightboxSrc} alt="Enlarged" />}
        <button className={styles.closeLightbox} onClick={()=>setLightboxSrc(null)}>
          <X size={24}/>
        </button>
      </Modal>
    </>
  );
};

export default DjDetailAnchored;