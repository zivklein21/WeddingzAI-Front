import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Songs from './Songs';
import Recommendations from './Recommandations';
import styles from './DetailsMatters.module.css';
import { ToastContainer } from 'react-toastify';

const DetailsMatters: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.detailsPage}>
      <div className={styles.detailsContainer}>
        <FiArrowLeft
          className={styles.backIcon}
          onClick={() => navigate(-1)}
          title="Go Back"
        />

        <h2 className={styles.detailsHeader}>Details Matter</h2>
        <hr className={styles.divider} />

        {/* 🎶 Scrollable Songs Zone */}
        <div className={styles.songsZone}>
          <Songs />
        </div>

        {/* 📋 Pinned Recommendations */}
        <div className={styles.detailsZone}>
          <Recommendations />
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default DetailsMatters;