import React, { useState, useRef, useEffect } from 'react';
import styles from './NavBar.module.css';
import logo from '../../assets/ wai-logo.svg';
import userIcon from "../../assets/images/user-icon.svg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth/AuthContext';

interface NavBarProps {
  title: string;
}

export const NavBar: React.FC<NavBarProps> = ({title}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  const handleLogoutClick = () => setShowConfirm(true);
  const cancelLogout = () => setShowConfirm(false);
  const confirmLogout = () => {
    logout();
    navigate('/auth');
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (confirmRef.current && !confirmRef.current.contains(e.target as Node)) {
        setShowConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/home">
          <img src={logo} alt="Logo" style={{ height: '200px' }} />
        </a>
      </div>

      <div className={styles.title}>
        {user ? (
          <a href="/weddash">{title}</a>
        ) : (
          <a href="/auth?mode=login">{title}</a>
        )}
      </div>

      {user ? (
        <div className={styles.authWrapper}>
          <img src={user.avatar} alt="User Avatar" />
          <div className={styles.authInfo}>
            <div className={styles.authName}><strong>{user.firstPartner}</strong></div>
            <div className={styles.auth}>
              <a href="/profile">Profile</a> |{" "}
              <div className={styles.logoutContainer}>
                <a onClick={handleLogoutClick} className={styles.logoutButton}>Logout</a>
                {/* <button onClick={handleLogoutClick} className={styles.logoutButton}>Logout</button> */}

                {showConfirm && (
                  <div className={styles.logoutConfirm} ref={confirmRef}>
                    <span>Are you sure?</span>
                    <div className={styles.logoutActions}>
                      <a onClick={cancelLogout} className={styles.logoutOption}>Cancel</a>
                      <a onClick={confirmLogout} className={styles.logoutOption}>Yes</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.authWrapper}>
          <img src={userIcon} alt="Guest Icon" />
          <div className={styles.authInfo}>
            <div className={styles.authName}><strong>Anonymous</strong></div>
            <div className={styles.auth}>
              <a href="/auth?mode=login">Login</a> |{" "}
              <a href="/auth?mode=signup">Register</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
