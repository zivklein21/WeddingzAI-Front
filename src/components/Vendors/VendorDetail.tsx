import React from "react";
import styles from "./VendorDetails.module.css";
import { X } from "lucide-react";


// src/components/Vendors/VendorDetail.tsx

export interface VendorDetailProps {
  vendor: {
    id: string;
    category: string;
    name: string;
    address: string;
    rating: number;
    price_range: string;
    about: string;
    contact: { phone: string; email: string; instagram: string | null; facebook: string | null };
    reviews: { reviewer: string; rating: number; comment: string }[];
    coverImage: string;
    logoUrl: string;
    imageUrls: string[];
    videoUrls: string[];
    tabs: string[];            // ← הוספת השדה פה
  };
  onClose: () => void;
}

const DEFAULT_IMG = "http://localhost:4000/uploads/vendors/dj.png";

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        {/* Cover + Logo (hard-coded path) */}
        <div className={styles.header}>
          <img
            className={styles.coverImg}
            src={DEFAULT_IMG}
            alt={`${vendor.name} cover`}
          />
          <img
            className={styles.logo}
            src={DEFAULT_IMG}
            alt={`${vendor.name} logo`}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{vendor.name}</h1>
          <p className={styles.category}>{vendor.category}</p>
          <p className={styles.address}>{vendor.address}</p>
          <p className={styles.meta}>
            Rating: {vendor.rating.toFixed(1)} • Price: {vendor.price_range}
          </p>
        </div>

        <section className={styles.section}>
          <h2>About</h2>
          <p>{vendor.about}</p>
        </section>

        <section className={styles.section}>
          <h2>Contacts</h2>
          <p><strong>Phone:</strong> {vendor.contact.phone}</p>
          <p><strong>Email:</strong> {vendor.contact.email}</p>
          {vendor.contact.instagram && (
            <p>
              <strong>Instagram:</strong>{" "}
              <a href={vendor.contact.instagram} target="_blank" rel="noreferrer">
                {vendor.contact.instagram}
              </a>
            </p>
          )}
          {vendor.contact.facebook && (
            <p>
              <strong>Facebook:</strong>{" "}
              <a href={vendor.contact.facebook} target="_blank" rel="noreferrer">
                {vendor.contact.facebook}
              </a>
            </p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Photos &amp; Videos</h2>
          <div className={styles.mediaGrid}>
            {/* Always using the default image */}
            {[0,1,2,3].map((i) => (
              <img
                key={`img-${i}`}
                src={DEFAULT_IMG}
                alt={`${vendor.name} photo ${i + 1}`}
                className={styles.mediaImage}
              />
            ))}
            {vendor.videoUrls.map((_, i) => (
              <video
                key={`vid-${i}`}
                src={DEFAULT_IMG}           // fallback video poster
                controls
                className={styles.mediaVideo}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Reviews</h2>
          {vendor.reviews.map((r, i) => (
            <div key={i} className={styles.review}>
              <p><strong>{r.reviewer}</strong> ({r.rating.toFixed(1)}/5)</p>
              <p>{r.comment}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default VendorDetail;