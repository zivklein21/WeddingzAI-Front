import Modal from 'react-modal';
import styles from '../vendors.module.css';
import {Vendor } from '../../../types/Vendor';
Modal.setAppElement('#root');


interface Props {
  vendor:      Vendor;
  onNavClick: (id: string) => void;
}

const VendorNav: React.FC<Props> = ({ vendor, onNavClick }) => {
  // Presence checks
  const has = {
    about:    !!vendor.about?.trim(),
    details:  vendor.price_range || vendor.services || vendor.area || vendor.hour_limits || vendor.genres || vendor.max_companions || vendor.max_guests || vendor.min_guests || vendor.price_include
    || vendor.seasons || vendor.end_time,
    photos:   Array.isArray(vendor.eventImages) && vendor.eventImages.length > 0,
    faqs:     Array.isArray(vendor.faqs)        && vendor.faqs!.length > 0,
    reviews:  Array.isArray(vendor.reviews)&& vendor.reviews!.length > 0,
    contact:  !!(vendor.socialMedia?.facebook || vendor.socialMedia?.instagram || vendor.website),
  };

  return (
      <nav className={styles.nav}>
        {has.about   && <button onClick={() => onNavClick('about')}>About</button>}
        {has.details && <button onClick={() => onNavClick('details')}>Details</button>}
        {has.photos  && <button onClick={() => onNavClick('photos')}>Photos</button>}
        {has.faqs    && <button onClick={() => onNavClick('faqs')}>FAQs</button>}
        {has.reviews && <button onClick={() => onNavClick('reviews')}>Bride’s Words</button>}
        {has.contact && <button onClick={() => onNavClick('contact')}>Contact</button>}
      </nav>
  );
};

export default VendorNav;