import React from "react";
import VendorAccordion from "./VendorAccordion";
import { Vendor
  
 } from "../../types/Vendor";
interface Props {
  vendors: Vendor[];
  isMyVendorsView?: boolean
}

const VendorAccordionGroup: React.FC<Props> = ({ vendors , isMyVendorsView}) => {
  const grouped = vendors.reduce((acc: Record<string, Vendor[]>, v) => {
    if (!acc[v.vendorType]) acc[v.vendorType] = [];
    acc[v.vendorType].push(v);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([type, list]) => (
        <VendorAccordion key={type} title={type} vendors={list} showViewAll={isMyVendorsView}/>
      ))}
    </>
  );
};

export default VendorAccordionGroup;