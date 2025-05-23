import { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
import heroImage from "../../assets/images/homePage1.svg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth/AuthContext";
import tdlService from '../../services/tdl-service';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();

  const [hasWeddingDocs, setHasWeddingDocs] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDocs = async () => {
      if (isAuthenticated && user) {
        try {
          const userId = (user as any)._id;
          const docs = await tdlService.getByUserId(userId);
          setHasWeddingDocs(Array.isArray(docs) && docs.length > 0);
        } catch (err) {
          console.error("Error checking docs:", err);
          setHasWeddingDocs(false);
        }
      }
    };

    checkDocs();
  }, [isAuthenticated, user]);

  const handleButtonClick = () => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (hasWeddingDocs) {
      navigate('/weddash');
    } else {
      navigate('/plan');
    }
  };

  const buttonText = !isAuthenticated
    ? "Let's Plan A Wedding"
    : hasWeddingDocs
    ? "Go to My Wedding"
    : "Let's Plan A Wedding";

  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1>
            <span className={styles.highlight}>Online</span><br />
            <span className={styles.highlight}>Wedding Planner</span>
          </h1>
          <p>Your wedding planning website, with everything you need to create the perfect day.</p>
          <button className={styles.button} onClick={handleButtonClick}>
            {buttonText}
          </button>
        </div>
        <div className={styles.right}>
          <img src={heroImage} alt="Hero Illustration" />
        </div>
      </div>
    </div>
  );
}
