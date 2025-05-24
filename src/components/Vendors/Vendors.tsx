import React, { useEffect, useState } from "react";
import vendorService from "../../services/vendor-service";
import { Vendor } from "../../types/Vendor";
import VendorAccordionGroup from "./AccordionGroup";
import styles from "./Vendors.module.css";
import {FiArrowLeft, FiLoader} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';



const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  vendorService.fetchRelevantVendors()
    .then(data => {
      console.log("📦 got vendors:", data);
      setVendors(data);
    })
    .catch(err => {
      console.error("❌ fetchRelevantVendors failed:", err);
    })
    .finally(() => setLoading(false));
}, []);

  return (
    <div className={styles.vendorPage}>
      <div className={styles.vendorContainer}>
        <FiArrowLeft
          className={styles.backIcon}
          onClick={() => navigate(-1)}
          title="Go Back"
        />

        <h2 className={styles.vendorHeader}>My Vendors</h2>
        <div className={styles.vendorSection}>
          {loading ? <FiLoader className={styles.spinner} /> : <VendorAccordionGroup vendors={vendors} isMyVendorsView={true}/>}
        </div>
      </div>
    </div>
  );
};

export default Vendors;