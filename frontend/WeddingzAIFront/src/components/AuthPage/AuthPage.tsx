import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import logo from '../../assets/ wai-logo.svg';
import loginImage from '../../assets/images/wedTable.svg.webp';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authBox}>
        {isLogin ? (
          <>
            <div className={styles.formWrapper}>
              <img src={logo} alt="WAI" className={styles.logo} />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className={styles.loginButton}>LOGIN</button>
              <p className={styles.chnageForm}>
                Don't have an account?{' '}
                <span className={styles.toggle} onClick={toggleForm}>
                  Sign up
                </span>
              </p>
            </div>
            <div className={styles.imageWrapper}>
              <img src={loginImage} alt="Login visual" />
            </div>
          </>
        ) : (
          <>
            <div className={styles.imageWrapper}>
              <img src={loginImage} alt="Signup visual" />
            </div>
            <div className={styles.formWrapper}>
              <img src={logo} alt="WAI" className={styles.logo} />
              <input type="email" placeholder="Email" />
              <input type="tel" placeholder="Phone" />
              <input type="password" placeholder="Password" />
              <button className={styles.loginButton}>SIGNUP</button>
              <p className={styles.chnageForm}>
                Already have an account?{' '}
                <span className={styles.toggle} onClick={toggleForm}>
                  Login
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
