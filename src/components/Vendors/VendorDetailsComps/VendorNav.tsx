// src/components/Vendors/VendorDetailsComps/VendorNav.tsx
import React, { useState, useEffect } from 'react';
import styles from '../vendors.module.css';
import vendorService from "../../../services/vendor-service";
import { useAuth } from "../../../hooks/useAuth/AuthContext";
import { toast } from "react-toastify";
import * as Icons from "../../../icons/index";
import {User} from "../../../types/user";
import { Vendor } from '../../../types/Vendor';
interface Props {
  vendor: Vendor;
  onNavClick: (id: string) => void;
  onUnbook?: (id: string) => void;
}

export type BookedVendor = {
  vendorId: string;
  vendorType: string;
};

const VendorNav: React.FC<Props> = ({ vendor, onNavClick, onUnbook }) => {
  const { user, updateUserSession } = useAuth();
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const bookedList = ((user as { bookedVendors?: { vendorId: string; vendorType: string }[] })?.bookedVendors) || [];
    const match = bookedList.find((v) => v.vendorId === vendor._id);
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
      if (res.data?.message === "TYPE_ALREADY_BOOKED") {
        toast.warn(`You already booked a vendor of type "${res.data?.vendorType}"`);
      }

      // added === true → Book
      if (res.data?.added === true) {
        setBooked(true);
        toast.success(`Vendor "${vendor.name}" booked`);

        // ➔ עדכון user context: הוספת ID
        const oldList = (user as User).bookedVendors || [];
        updateUserSession({
          ...user,
          bookedVendors: [...oldList, vendor._id],
        });
        return;
      }

      // added === false → Unbook
      if (res.data?.added === false) {
        setBooked(false);
        toast.warn(`Vendor "${vendor.name}" unbooked`);

        const oldList2 = (user as User).bookedVendors as BookedVendor[] || [];

        const newList = oldList2.filter((x) => x.vendorId !== vendor._id);

        updateUserSession({
          ...user,
          bookedVendors: newList,
        });

        // אם קיים callback להסרת הכרטיס בדף הפרופיל
        onUnbook?.(vendor._id);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }, message?: string };
      console.error("❌ Failed to toggle booking", err);
      const msg = error?.response?.data?.error || error.message || "Unexpected error";
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

      <Icons.BookIcon
        className={`icon ${booked ? 'ai-sent' : 'icon'}`}
        onClick={toggleBooked}
        title={booked ? "Unbookmark Vendor" : "Bookmark Vendor"}
      />
    </nav>
  );
};

export default VendorNav;