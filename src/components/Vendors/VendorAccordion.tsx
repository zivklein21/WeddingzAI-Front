import React, { useState } from "react";
import VendorCardList from "./VendorCardList";
import { Vendor } from "../../types/Vendor";
import styles from "./vendors.module.css";
import {FiChevronUp, FiChevronDown} from 'react-icons/fi';


interface Props {
  title: string;
  vendors: Vendor[];
  showViewAll?: boolean;
}

const VendorAccordion: React.FC<Props> = ({ title, vendors , showViewAll}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.vendorAccordion}>
      <div className={styles.accordionHeader} onClick={() => setOpen(!open)}>
        <div className={styles.accordionTitle}>
          {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          <span>{title}</span>
        </div>
        {showViewAll && (
            <div className={styles.viewAll}>
              <a className={styles.viewAll} href={`/vendors`}>View All</a>            
            </div>
          )}
        
      </div>
      {open && <VendorCardList vendors={vendors} />}
    </div>
  );
};

export default VendorAccordion;