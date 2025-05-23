import React from "react";
import { Vendor } from "../../types/Vendor";
import styles from "./vendors.module.css";

interface Props {
  vendor: Vendor;
  onClick?: () => void;
}

const VendorCard: React.FC<Props> = ({ vendor, onClick }) => {
  return (
    <div className={styles.vendorCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={vendor.coverImage || vendor.profileImage} alt={vendor.name} />
        <div className={styles.overlay}>
          <h4>{vendor.name}</h4>
        </div>
      </div>
</div>
  );
};

export default VendorCard;