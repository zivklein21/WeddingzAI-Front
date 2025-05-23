import React, { useEffect, useState } from "react";
import vendorService from "../../services/vendor-service";
import { Vendor } from "../../types/Vendor";
import VendorAccordionGroup from "./AccordionGroup";
import styles from "./Vendors.module.css";
import {FiArrowLeft, FiLoader} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';



const AllVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  vendorService.fetchAllVendors()
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

        <h2 className={styles.vendorHeader}>All Vendors</h2>
        <div className={styles.vendorSection}>
          {loading ? <FiLoader className={styles.spinner} /> : <VendorAccordionGroup vendors={vendors} isMyVendorsView={false}/>}
        </div>
      </div>
    </div>
  );
};

export default AllVendors;