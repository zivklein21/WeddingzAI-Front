import React from 'react';
import { useNavigate } from 'react-router-dom';
import Songs from './Songs';
import Recommendations from './Recommandations';
import styles from './DetailsMatters.module.css';
import { ToastContainer } from 'react-toastify';
import * as Icons from "../../icons/index";

const DetailsMatters: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pageMain">
      <div className="pageContainer">
        <Icons.BackArrowIcon
          className="backIcon"
          onClick={() => navigate(-1)}
          title="Go Back"
        />

        <h2 className="pageHeader">Details Matter</h2>

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