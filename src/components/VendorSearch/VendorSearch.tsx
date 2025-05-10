// src/components/VendorSearch/VendorSearch.tsx

import React, { useState } from "react";
import vendorService, { Vendor } from "../../services/vendors-service";
import VendorDetail from "../Vendors/VendorDetail";
import styles from "./VendorSearch.module.css";

// Hard-coded default cover on your Express server:
const DEFAULT_IMG = "http://localhost:4000/uploads/vendors/dj.png";

type UIVendor = Vendor & {
  about: string;
  videoUrls: string[];
  tabs: string[];
  coverImage: string;  // ensure we always have this field
};

const VendorsSearch: React.FC = () => {
  const [vendorType, setVendorType] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [vendors, setVendors] = useState<UIVendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<UIVendor | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!vendorType || !city || !date) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);

    try {
      const resp = await vendorService.fetchVendors(vendorType, city, date);

      // Normalize each vendor so it has coverImage, about, videoUrls, tabs:
      const normalized: UIVendor[] = resp.vendorList.map((v) => ({
        ...v,
        coverImage: (v as any).coverImage || DEFAULT_IMG,
        about:       (v as any).about     || "No description available.",
        videoUrls:   (v as any).videoUrls || [],
        tabs: [
          "About",
          "Contacts",
          "Photos & Videos",
          "Reviews",
          "Pricing",
          "FAQs",
          "Meet the Team",
        ],
      }));

      setVendors(normalized);
    } catch {
      setError("Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Find Venues and Vendors</h1>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category (e.g. photographers)"
          value={vendorType}
          onChange={(e) => setVendorType(e.target.value)}
        />
        <input
          type="text"
          placeholder="City or region"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {vendors.map((v) => (
          <div
            key={v.id}
            className={styles.card}
            onClick={() => setSelected(v)}
            style={{
              backgroundImage: `url(${v.coverImage})`,
            }}
          >
            <div className={styles.overlay} />
            <h3>{v.name}</h3>
          </div>
        ))}
      </div>

      {selected && (
        <VendorDetail
          vendor={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default VendorsSearch;