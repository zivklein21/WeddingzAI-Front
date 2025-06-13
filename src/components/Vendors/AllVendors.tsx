import React, { useEffect, useState } from "react";
import {fetchAllVendors} from "../../services/vendor-service";
import { Vendor } from "../../types/Vendor";
import VendorAccordionGroup from "./AccordionGroup";
import styles from "./Vendors.module.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Icons from "../../icons/index";



export const AllVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAllVendors()
      .then(data => {
        setVendors(data);
      })
      .catch(err => {
        console.error("❌ fetch failed:", err);
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p><Icons.LoaderIcon className="spinner"/></p>;


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
            <h2 className="pageHeader">Vendors
            </h2>
            
          </div>

          <div className={styles.vendorSection}>
            {loading ? (
              <Icons.LoaderIcon className="spinner" />
            ) : (
              <VendorAccordionGroup vendors={vendors} isMyVendorsView={false} />
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AllVendors;