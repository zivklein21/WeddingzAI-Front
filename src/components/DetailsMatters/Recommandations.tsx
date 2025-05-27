import React from 'react';
import styles from './detailsMatters.module.css';
import { FaGift, FaLeaf, FaClipboardList } from 'react-icons/fa';

const Recommendations: React.FC = () => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>Wedding Details & Recommendations</h2>
    <div className={styles.recommendations}>
      <div className={styles.category}>
        <div className={styles.recommendHeader}>
            <span className={styles.recommendIcon}>
                <FaGift className={styles.icon} />
            </span>
            <h3>Guest Favors</h3>
        </div>  
        <ul className={styles.linkList}>
          <li>
            <a href="https://urbanbridesmag.co.il/שופינג-אונליין-מציאות-לחתונה-מאלי-אקספרס.html" target="_blank" rel="noopener noreferrer">
              Personalized Wedding Favors
            </a>
          </li>
          <li>
            <a href="https://docs.google.com/spreadsheets/d/1PU9aCVYIAWQ-2wpToobJ1fqXFY9wYaFtdxV63CEs5uk/htmlview#gid=0" target="_blank" rel="noopener noreferrer">
              Document with all recommendations from AliExpress
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <div className={styles.recommendHeader}>
            <span className={styles.recommendIcon}>
                <FaLeaf className={styles.icon} />
            </span>
            <h3>Decoration Ideas</h3>
        </div>
        <ul className={styles.linkList}>
          <li>
            <a href="https://www.pinterest.com/stylemepretty/wedding-decorations-furniture/" target="_blank" rel="noopener noreferrer">
              Pinterest Wedding Arch Decorations
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <div className={styles.recommendHeader}>
            <span className={styles.recommendIcon}>
                <FaClipboardList className={styles.icon} />
            </span>
            <h3>Wedding Planning Tips</h3>
        </div>
        <ul className={styles.tipsList}>
          <li>Create a detailed timeline for the wedding day</li>
          <li>Prepare a backup plan for outdoor ceremonies</li>
          <li>Have a designated person for vendor coordination</li>
          <li>Create a wedding day emergency kit</li>
        </ul>
      </div>
    </div>
  </section>
);

export default Recommendations;