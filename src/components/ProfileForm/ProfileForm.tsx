import React, { useEffect, useState } from "react";
import styles from "./ProfileForm.module.css";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import defaultAvatar from "../../assets/images/user-icon.svg";

interface UserDetails {
  username: string;
  email: string;
  firstPartner: string;
  secondPartner: string;
  avatar: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    firstPartner: "",
    secondPartner: "",
    avatar: defaultAvatar,
  });
  

  const { user, updateUserSession } = useAuth();

  // Get User Details
  useEffect(() => {
    if (user) {
      setUserDetails({
        username: "test",
        email: user.email || "",
        firstPartner: user.firstPartner || "",
        secondPartner: user.secondPartner || "",
        avatar:
          user.avatar && user.avatar.trim() !== ""
            ? user.avatar.startsWith("/storage/")
              ? user.avatar
              : user.avatar
            : defaultAvatar,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    console.log("Updated details:", userDetails);
    // future: send userDetails to backend via fetch/axios
  };

  return (
    <div className={styles.main}>
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>Your Profile</h2>
        <p className={styles.profileSubtitle}>Edit your personal info</p>

        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img src={userDetails.avatar} alt="Avatar" className={styles.avatar} />
            </div>
          </div>
          <form className={styles.infoSection} onSubmit={handleSubmit}>
            <div className={styles.infoItem}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.infoItem}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.infoItem}>
              <label>First Partner:</label>
              <input
                type="text"
                name="firstPartner"
                value={userDetails.firstPartner}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.infoItem}>
              <label>Second Partner:</label>
              <input
                type="text"
                name="secondPartner"
                value={userDetails.secondPartner}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.updateBtn}>
              Update Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
