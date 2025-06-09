import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import styles from './vendors.module.css';
import VendorHeader from './VendorDetailsComps/VendorHeader';
import VendorNav from './VendorDetailsComps/VendorNav';
import VendorAbout from './VendorDetailsComps/VendorAbout';
import VendorDetails from './VendorDetailsComps/VendorDetails';
import VendorPhotos from './VendorDetailsComps/VendorPhotos';
import VendorFaqs from './VendorDetailsComps/VendorFaqs';
import VendorReviews from './VendorDetailsComps/VendorReviews';
import VendorContact from './VendorDetailsComps/VendorContact';
import { Vendor } from '../../types/Vendor';

Modal.setAppElement('#root');

interface Props {
  vendor: Vendor;
  isOpen: boolean;
  onClose: () => void;
  onUnbook?: (id: string) => void;
}

const VendorModel: React.FC<Props> = ({ vendor, isOpen, onClose, onUnbook }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) contentRef.current.scrollTop = 0;
  }, [isOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Presence checks
  const has = {
    about:    !!vendor.about?.trim(),
    details:  vendor.price_range || vendor.services || vendor.area || vendor.hour_limits || vendor.genres || vendor.max_companions || vendor.max_guests || vendor.min_guests || vendor.price_include
    || vendor.seasons || vendor.end_time,
    photos:   Array.isArray(vendor.eventImages) && vendor.eventImages.length > 0,
    faqs:     Array.isArray(vendor.faqs)        && vendor.faqs!.length > 0,
    reviews:  Array.isArray(vendor.reviews)&& vendor.reviews!.length > 0,
    contact:  !!(vendor.socialMedia?.facebook || vendor.socialMedia?.instagram || vendor.website),
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} overlayClassName={styles.overlayModel} className={styles.modal}>
      <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
      <VendorHeader vendor={vendor} onClose={onClose}/>
      <VendorNav vendor={vendor} onNavClick={scrollTo} onUnbook={onUnbook}/>

      <div className={styles.content} ref={contentRef}>
        {has.about && <VendorAbout vendor={vendor} isOpen={isOpen} />}
        {has.details && <VendorDetails vendor={vendor} isOpen={isOpen}/>}
        {has.photos && <VendorPhotos images={vendor.eventImages || []} />}
        {has.faqs && <VendorFaqs faqs={vendor.faqs || []} openFaq={openFaq} setOpenFaq={setOpenFaq} />}
        {has.reviews && <VendorReviews reviews={vendor.reviews || []} expanded={expandedReview} setExpanded={setExpandedReview} />}
        {has.contact && <VendorContact vendor={vendor} />}
      </div>
    </Modal>
  );
};

export default VendorModel;