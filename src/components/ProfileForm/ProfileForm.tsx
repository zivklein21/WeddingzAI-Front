import React, { useState } from "react";
import styles from "./ProfileForm.module.css";

const Profile = () => {

  const [userDetails, setUserDetails] = useState({
    username: "gabi_wedding",
    email: "gabim435@gmail.com",
    firstPartner: "Gabi",
    secondPartner: "Alex",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIro04DxB9zegqcVGmzkmqBuaTkRAwfd2w1FxzFPZywV0hXXvRk=s96-c"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    console.log("Updated details:", userDetails);
  };

  return (
    <div className={styles.main}>
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>Your Profile</h2>
        <p className={styles.profileSubtitle}>Edit your personal info</p>

        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <img src={userDetails.avatar} alt="Avatar" className={styles.avatar} />
          </div>
          <div className={styles.infoSection}>
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
            <button className={styles.updateBtn} onClick={handleUpdate}>
              Update Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;