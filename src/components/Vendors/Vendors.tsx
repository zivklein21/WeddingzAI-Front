import React, { useEffect, useState } from "react";
import vendorService from "../../services/vendor-service";
import { Vendor } from "../../types/Vendor";
import VendorAccordionGroup from "./AccordionGroup";
import styles from "./Vendors.module.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Icons from "../../icons/index";


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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reloadVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.refetchRelevantVendors(); 
      setVendors(data);
      toast.success("Vendors reloaded");
    } catch (err) {
      toast.error("Failed to reload vendors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  return (
    <>
      <div className="pageMain">
        <div className="pageContainer">
          <Icons.BackArrowIcon
            className="backIcon"
            onClick={() => navigate(-1)}
            title="Go Back"
          />

          <div className={styles.headerRow}>
            <h2 className="pageHeader">My Vendors
              <Icons.RefreshIcon
              className="icon"
              onClick={reloadVendors}
              title="Reload Relevant Vendors"
            />
            </h2>
            
            
          </div>

          <div className={styles.vendorSection}>
            {loading ? (
              <Icons.LoaderIcon className="spinner" />
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