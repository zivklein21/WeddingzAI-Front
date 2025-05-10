import React from 'react';
import styles from './HomePage.module.css';
import heroImage from "../../assets/images/homePage1.svg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth/AuthContext";

export default function Home() {
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useAuth();

  const handleButtonClick = () => {
    if (loading) return; // optionally block clicks while loading

    if (isAuthenticated) {
      navigate('/plan');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1>
            <span className={styles.highlight}>Online</span><br />
            <span className={styles.highlight}>Wedding Planner</span>
          </h1>
          <p>Your wedding planning website, with everything you need to create the perfect day.</p>
          <button className={styles.button} onClick={handleButtonClick}>Let's Plan A Wedding</button>
        </div>

        <div className={styles.right}>
            <img src={heroImage} alt="Hero Illustration" />
        </div>
      </div>
    </div>
  );
};

