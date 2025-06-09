import React, { useState } from "react";
import VendorCard from "./VendorCard";
import { Vendor } from "../../types/Vendor";
import styles from "./vendors.module.css";
import VendorModel from "./VendorModel";

interface Props {
  vendors: Vendor[];
  onUnbook?: (id: string) => void;
}

const VendorCardList: React.FC<Props> = ({ vendors , onUnbook}) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  return (
    <>
      <div className={styles.vendorList}>
        {vendors.map(v => (
          <>
            <VendorCard key={v._id} vendor={v} onClick={() => setSelectedVendor(v)} />
          </>

        ))}
      </div>

      {selectedVendor && (
        <VendorModel
          vendor={selectedVendor}
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onUnbook={onUnbook && (() => {
            onUnbook(selectedVendor._id);
            setSelectedVendor(null);
          })}
        />
      )}
    </>
  );
};

export default VendorCardList;