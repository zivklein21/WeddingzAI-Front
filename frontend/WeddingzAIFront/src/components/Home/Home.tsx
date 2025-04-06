import React from 'react';
import styles from './HomePage.module.css';
import heroImage from "../../assets/images/homePage1.svg";

export default function Home() {
  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1>
            <span className={styles.highlight}>Online</span><br />
            <span className={styles.highlight}>Wedding Planner</span>
          </h1>
          <p>Your wedding planning website, with everything you need to create the perfect day.</p>
          <button className={styles.button}>Create New Wedding</button>
        </div>

        <div className={styles.right}>
            <img src={heroImage} alt="Hero Illustration" />
        </div>
      </div>
    </div>
  );
};

