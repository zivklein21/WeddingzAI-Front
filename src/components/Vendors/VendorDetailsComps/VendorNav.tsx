import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';
import { BsBookmarkHeart } from "react-icons/bs";
import vendorService from "../../../services/vendor-service";
import { useAuth } from "../../../hooks/useAuth/AuthContext";
import { toast } from "react-toastify";

Modal.setAppElement('#root');

interface Props {
  vendor: Vendor;
  onNavClick: (id: string) => void;
}

const VendorNav: React.FC<Props> = ({ vendor, onNavClick }) => {
  const { user } = useAuth();
  const [booked, setBooked] = useState(false);

useEffect(() => {
  const bookedList = (user as any)?.bookedVendors || [];
  const match = bookedList.find((v: any) =>
    typeof v === 'string' ? v === vendor._id : v.vendorId === vendor._id
  );
  setBooked(!!match);
}, [user, vendor._id]);

const toggleBooked = async () => {
  try {
    const res = await vendorService.toggleBookedVendor(vendor._id);

    if (!res) {
      toast.error("Unexpected error from server");
      return;
    }

    if (res.message === "TYPE_ALREADY_BOOKED") {
      toast.warn(`You already booked a vendor of type "${res.vendorType}"`);
    } else if (res.added === true) {
      setBooked(true);
      toast.success(`Vendor "${vendor.name}" booked`);
    } else if (res.added === false) {
      setBooked(false);
      toast.warn(`Vendor "${vendor.name}" unbooked`);
    }

  } catch (err: any) {
    console.error("❌ Failed to toggle booking", err);
    const msg = err?.response?.data?.message || err.message || "Unexpected error";
    toast.error(msg);
  }
};

  const has = {
    about: !!vendor.about?.trim(),
    details: vendor.price_range || vendor.services || vendor.area || vendor.hour_limits || vendor.genres || vendor.max_companions || vendor.max_guests || vendor.min_guests || vendor.price_include || vendor.seasons || vendor.end_time,
    photos: Array.isArray(vendor.eventImages) && vendor.eventImages.length > 0,
    faqs: Array.isArray(vendor.faqs) && vendor.faqs.length > 0,
    reviews: Array.isArray(vendor.reviews) && vendor.reviews.length > 0,
    contact: !!(vendor.socialMedia?.facebook || vendor.socialMedia?.instagram || vendor.website),
  };

  return (
    <nav className={styles.nav}>
      {has.about   && <button onClick={() => onNavClick('about')}>About</button>}
      {has.details && <button onClick={() => onNavClick('details')}>Details</button>}
      {has.photos  && <button onClick={() => onNavClick('photos')}>Photos</button>}
      {has.faqs    && <button onClick={() => onNavClick('faqs')}>FAQs</button>}
      {has.reviews && <button onClick={() => onNavClick('reviews')}>Bride’s Words</button>}
      {has.contact && <button onClick={() => onNavClick('contact')}>Contact</button>}

      <BsBookmarkHeart
        className={`${styles.bookmarkIcon} ${booked ? styles.booked : styles.unbooked}`}
        onClick={toggleBooked}
        title={booked ? "Unbookmark Vendor" : "Bookmark Vendor"}
      />
    </nav>
  );
};

export default VendorNav;