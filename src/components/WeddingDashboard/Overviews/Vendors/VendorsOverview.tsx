import React, { useEffect, useState } from "react";
import styles from "./VendorsOverview.module.css";
import { fetchVendorSummary } from "../../../../services/vendor-service";
import * as Icons from "../../../../icons/index";

const VendorOverview: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchVendorSummary();
        setTotal(data.data?.total || 0);
        setCounts(data.data?.counts || {});
      } catch (err) {
        console.error("Could not load vendor summary:", err);
        setError("Failed to load vendor summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Icons.LoaderIcon className="spinner"/>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}><Icons.ErrorIcon className="errorIcon"/></div>;
  }

  if (total === 0) {
    return <div className={styles.empty}><Icons.NoOffersIcon className="icon"/></div>;
  }

  return (
    <div>
      <p className={styles.total}>Total Vendors: {total}</p>
      <ul className={styles.vendorList}>
        {Object.entries(counts)
          .slice(0, 2)
          .map(([type, count]) => (
            <li key={type}>
              - {type}: {count} proposals
            </li>
          ))}
      </ul>
    </div>
  );
};

export default VendorOverview;