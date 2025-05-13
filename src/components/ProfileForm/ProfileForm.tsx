import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfileForm.module.css";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import defaultAvatar from "../../assets/images/user-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import fileService from "../../services/file-service";

interface UserDetails {
  username: string;
  email: string;
  firstPartner: string;
  secondPartner: string;
  avatar: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: "",
    email: "",
    firstPartner: "",
    secondPartner: "",
    avatar: defaultAvatar,
  });

  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUserSession } = useAuth();

  useEffect(() => {
    if (user) {
      setUserDetails({
        username: "test",
        email: user.email || "",
        firstPartner: user.firstPartner || "",
        secondPartner: user.secondPartner || "",
        avatar:
          user.avatar && user.avatar.trim() !== ""
            ? user.avatar.startsWith("/uploads/")
              ? user.avatar
              : user.avatar
            : defaultAvatar,
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatarFile(file); // keep reference to file
      const previewUrl = URL.createObjectURL(file);
      setUserDetails((prev) => ({ ...prev, avatar: previewUrl }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let avatarUrl = userDetails.avatar;

    if (newAvatarFile) {
      try {
        const formData = new FormData();
        formData.append("file", newAvatarFile);
        const response = await fileService.uploadImageFile(newAvatarFile);

        // Adjust this if your backend returns `url` instead of `fileName`
        avatarUrl = response.data.url;
        console.log("Uploaded avatar URL:", avatarUrl);
      } catch (err) {
        console.error("Error uploading avatar", err);
        return;
      }
    }

    const updatedDetails = {
      ...userDetails,
      avatar: avatarUrl,
    };

    console.log("Final details to submit:", updatedDetails);
    // In the future: send `updatedDetails` to your backend user update route
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
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              <FontAwesomeIcon icon={faImage} className={styles["fa-l"]} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <form className={styles.infoSection} onSubmit={handleSubmit}>
            {/* Input fields */}
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
