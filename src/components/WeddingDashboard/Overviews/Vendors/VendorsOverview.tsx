import React, { useEffect, useState } from "react";
import styles from "./VendorsOverview.module.css";
import { fetchVendorSummary } from "../../../../services/vendor-service";
import {FiLoader} from 'react-icons/fi';




const VendorOverview: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorSummary()
      .then((data) => {
        setTotal(data.total);
        setCounts(data.counts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <FiLoader className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <p className={styles.total}>Total Vendors: {total}</p>
      <hr />
      <ul className={styles.vendorList}>
        {Object.entries(counts).map(([type, count]) => (
          <li key={type}>
            - {type}: {count} proposals
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorOverview;