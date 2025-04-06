import React from 'react';
import styles from './NavBar.module.css';
import logo from '../../assets/ wai-logo.svg';
import userIcon from "../../assets/images/user-icon.svg";
import { useAuth } from '../../hooks/useAuth/AuthContext';

export const NavBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" style={{ height: '200px' }} />
      </div>

      <div className={styles.title}>My Weddings</div>

      {user ? (
        <div className={styles.authWrapper}>
          <img src={user.avatar || userIcon} alt="User Avatar" />
          <div>
            <div className={styles.authName}><strong>{user.firstPartner}</strong></div>
            <div className={styles.auth}>
              <a href="/profile">Profile</a>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.authWrapper}>
          <img src={userIcon} alt="Guest Icon" />
          <div>
            <div className={styles.authName}><strong>Anonymous</strong></div>
            <div className={styles.auth}>
              <a href="/auth?mode=login">Login</a> | <a href="/auth?mode=signup">Register</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};