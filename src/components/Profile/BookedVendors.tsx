import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "./BookedVendors.module.css";
import vendorService from "../../services/vendor-service";
import { Vendor } from "../../types/Vendor";
import VendorCardList from "../Vendors/VendorCardList";

const BookedVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) בואי נקבל את כל ה-bookings (כל אחד עם vendor?. _id)
        const bookings = await vendorService.fetchBookedVendors();

        // 2) סינון והמרה ל-Vendor מלא
        const detailed = await Promise.all(
          bookings
            .map((b) => b.vendor?._id)                   
            .filter((id): id is string => Boolean(id))  
            .map((id) => vendorService.fetchVendorById(id))
        );

        setVendors(detailed);
      } catch (err) {
        console.error("Failed to load booked vendors:", err);
        toast.error("Failed to load booked vendors");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUnbook = (vendorId: string) => {
    setVendors(vs => vs.filter(v => v._id !== vendorId));
  };

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  if (vendors.length === 0) {
    return <p className={styles.empty}>No vendors booked yet.</p>;
  }

  return (
    <>
      <div className={styles.list}>
        <VendorCardList vendors={vendors} onUnbook={handleUnbook} />
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default BookedVendors;