import React, { useEffect, useState } from "react";
import vendorService from "../../services/vendor-service";
import { Vendor } from "../../types/Vendor";
import VendorAccordionGroup from "./AccordionGroup";
import styles from "./Vendors.module.css";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { TfiReload } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";


const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.fetchRelevantVendors(); // `/vendors/mine`
      setVendors(data);
    } catch (err) {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const reloadVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.refetchRelevantVendors(); // `/vendors/relvant`
      setVendors(data);
      toast.success("Vendors reloaded");
    } catch (err) {
      toast.error("Failed to reload vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  return (
    <>
      <div className={styles.vendorPage}>
        <div className={styles.vendorContainer}>
          <FiArrowLeft
            className={styles.backIcon}
            onClick={() => navigate(-1)}
            title="Go Back"
          />

          <div className={styles.headerRow}>
            <h2 className={styles.vendorHeader}>My Vendors
              <TfiReload
              className={styles.reload}
              onClick={reloadVendors}
              title="Reload Relevant Vendors"
            />
            </h2>
            
          </div>

          <div className={styles.vendorSection}>
            {loading ? (
              <FiLoader className={styles.spinner} />
            ) : (
              <VendorAccordionGroup vendors={vendors} isMyVendorsView={true} />
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Vendors;