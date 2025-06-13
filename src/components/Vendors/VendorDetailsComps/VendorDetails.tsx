import React, { useRef, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../vendors.module.css';
import { Vendor } from '../../../types/Vendor';
import * as Icons from "../../../icons/index";

Modal.setAppElement('#root');

interface Props {
  vendor:       Vendor;
  isOpen:       boolean;
}

const VendorDetails: React.FC<Props> = ({ vendor, isOpen }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // scroll to top whenever opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <>
      <div className={styles.content} ref={contentRef}>
          <section id="details" className={styles.section}>
            <h2>Details</h2>
            <ul>
              {vendor.accessorise && (
                <li><strong>Accessorise:</strong> {vendor.accessorise}</li>
              )}
              {vendor.area && (
                <li><strong>Area:</strong> {vendor.area}</li>
              )}
              {vendor.buy_options && (
                <li><strong>Buy Option:</strong> {vendor.buy_options}</li>
              )}
              {vendor.check_in && (
                <li><strong>Check In:</strong> {vendor.check_in}</li>
              )}
              {vendor.check_out && (
                <li><strong>Check Out:</strong> {vendor.check_out}</li>
              )}
              {vendor.price_range && (
                <li><strong>Price Range:</strong> {vendor.price_range}</li>
              )}
              {vendor.price_include && (
                <li><strong>Price Include:</strong> {vendor.price_include}</li>
              )}
              {vendor.services && (
                <li><strong>Services:</strong> {vendor.services}</li>
              )}
              {/* {vendor.close_venues && (
                <li><strong>Close Venues:</strong>  {vendor.close_venues.join(", ")}</li>
              )} */}
              {vendor.end_time && (
                <li><strong>End Time:</strong> {vendor.end_time}</li>
              )}
              {vendor.genres && (
                <li><strong>Genres:</strong> {vendor.genres}</li>
              )}
              {vendor.hour_limits && (
                <li><strong>Hour Limits:</strong> {vendor.hour_limits}</li>
              )}
              {vendor.location_facilities && vendor.location_facilities.length > 0 && (
                <li>
                  <strong>Location Facilities:</strong>
                  <ul style={{ 
                    marginTop: '5px', 
                    marginBottom: '5px', 
                    paddingLeft: '15px', 
                    listStyle: 'none' // Remove default bullets
                  }}>
                    {vendor.location_facilities.map((facility, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span className='icon'><Icons.RingIcon size={15}/></span>
                        {facility}
                      </li>
                    ))}
                  </ul>
                </li>
              )}      
              {vendor.max_companions && (
                <li><strong>Max Companions:</strong> {vendor.max_companions}</li>
              )}
              {vendor.max_guests && (
                <li><strong>Max Guests:</strong> {vendor.max_guests}</li>
              )}
              {vendor.max_vendors && (
                <li><strong>Max Vendors:</strong> {vendor.max_vendors}</li>
              )}
              {vendor.min_guests && (
                <li><strong>Min Guests:</strong> {vendor.min_guests}</li>
              )}
              {vendor.seasons && (
                <li><strong>Seasons:</strong> {vendor.seasons}</li>
              )}
              {vendor.serv_location && (
                <li><strong>Service Location:</strong> {vendor.serv_location}</li>
              )}
              {vendor.shoot_type && (
                <li><strong>Shoot Type:</strong> {vendor.shoot_type}</li>
              )}
              {vendor.size_range && (
                <li><strong>Size Rang:</strong> {vendor.size_range}</li>
              )}
              {vendor.weekend && (
                <li><strong>Weekend:</strong> {vendor.weekend}</li>
              )}
            </ul>
          </section>
      </div>
    </>
  );
};

export default VendorDetails;