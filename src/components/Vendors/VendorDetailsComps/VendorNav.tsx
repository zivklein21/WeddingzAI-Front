// src/components/Vendors/VendorDetailsComps/VendorNav.tsx
import React, { useState, useEffect } from 'react';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';
import { BsBookmarkHeart } from "react-icons/bs";
import vendorService from "../../../services/vendor-service";
import { useAuth } from "../../../hooks/useAuth/AuthContext";
import { toast } from "react-toastify";

interface Props {
  vendor: Vendor;
  onNavClick: (id: string) => void;
  onUnbook?: (id: string) => void;
}

const VendorNav: React.FC<Props> = ({ vendor, onNavClick, onUnbook }) => {
  const { user, updateUserSession } = useAuth();
  const [booked, setBooked] = useState(false);

  // סימון ראשוני על־פי רשימת bookedVendors ב-user context
  useEffect(() => {
    const bookedList = (user as any)?.bookedVendors || [];
    const match = bookedList.find((v: any) =>
      typeof v === 'string'
        ? v === vendor._id
        : v.vendorId === vendor._id
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

      // TYPE_ALREADY_BOOKED
      if (res.message === "TYPE_ALREADY_BOOKED") {
        toast.warn(`You already booked a vendor of type "${res.vendorType}"`);
        return;
      }

      // added === true → Book
      if (res.added === true) {
        setBooked(true);
        toast.success(`Vendor "${vendor.name}" booked`);

        // ➔ עדכון user context: הוספת ID
        const oldList = (user as any).bookedVendors || [];
        updateUserSession({
          ...user,
          bookedVendors: [...oldList, vendor._id],
        });
        return;
      }

      // added === false → Unbook
      if (res.added === false) {
        setBooked(false);
        toast.warn(`Vendor "${vendor.name}" unbooked`);

        // ➔ עדכון user context: הסרת ID
        const oldList2 = (user as any).bookedVendors || [];
        const newList = oldList2.filter((x: any) =>
          typeof x === "string" ? x !== vendor._id : x.vendorId !== vendor._id
        );
        updateUserSession({
          ...user,
          bookedVendors: newList,
        });

        // אם קיים callback להסרת הכרטיס בדף הפרופיל
        onUnbook?.(vendor._id);
      }
    } catch (err: any) {
      console.error("❌ Failed to toggle booking", err);
      const msg = err?.response?.data?.message || err.message || "Unexpected error";
      toast.error(msg);
    }
  };

  const has = {
    about:    !!vendor.about?.trim(),
    details:  !!(
      vendor.price_range ||
      vendor.services ||
      vendor.area ||
      vendor.hour_limits ||
      vendor.genres ||
      vendor.max_companions ||
      vendor.max_guests ||
      vendor.min_guests ||
      vendor.price_include ||
      vendor.seasons ||
      vendor.end_time ||
      vendor.weekend ||
      vendor.serv_location ||
      vendor.shoot_type ||
      vendor.check_in ||
      vendor.check_out ||
      vendor.max_vendors ||
      vendor.location_facilities ||
      vendor.close_venues ||
      vendor.size_range ||
      vendor.accessorise ||
      vendor.buy_options
    ),
    photos:   Array.isArray(vendor.eventImages) && vendor.eventImages.length > 0,
    faqs:     Array.isArray(vendor.faqs)        && vendor.faqs.length > 0,
    reviews:  Array.isArray(vendor.reviews)     && vendor.reviews.length > 0,
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

      <BsBookmarkHeart
        className={`${styles.bookmarkIcon} ${booked ? styles.booked : styles.unbooked}`}
        onClick={toggleBooked}
        title={booked ? "Unbookmark Vendor" : "Bookmark Vendor"}
      />
    </nav>
  );
};

export default VendorNav;