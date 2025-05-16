import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfileForm.module.css";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import defaultAvatar from "../../assets/images/user-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import fileService from "../../services/file-service";
import authService from "../../services/auth-service";

interface UserDetails {
  email: string;
  firstPartner: string;
  secondPartner: string;
  avatar: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    email: "",
    firstPartner: "",
    secondPartner: "",
    avatar: defaultAvatar,
  });

  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUserSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserDetails({
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
    setServerError(null);
    setSuccessMessage(null);
    e.preventDefault();

    let avatarUrl = userDetails.avatar;

    if (newAvatarFile) {
      try {
        const formData = new FormData();
        formData.append("file", newAvatarFile);
        const response = await fileService.uploadImageFile(newAvatarFile);
        avatarUrl = response.data.url;

      } catch (err) {
        setServerError("Failed to upload avatar.");
        return;
      }
    }

    const updatedDetails = {
      ...userDetails,
      avatar: avatarUrl,
    };

    try {
      // Update user details
      const { request: updateUserRequest } = await authService.updateUser(updatedDetails);
      const updateResponse = await updateUserRequest;

      if (updateResponse.status === 200) {
        setSuccessMessage("Profile updated successfully!");

        // Update user session
        const updatedUser = {
          ...user,
          ...updatedDetails,
        };

        updateUserSession(updatedUser);
        setUserDetails(updatedUser);
        setNewAvatarFile(null);
        setSuccessMessage("Profile updated successfully!");
        
      } else {
        setServerError("Failed to update profile.");
      }

    } catch (error: any) {
      setServerError(error.response?.data?.message || "An error occurred while updating the profile.");
    }

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

            {serverError && <div className={`${styles["alert-profile"]} ${styles["alert-danger-profile"]}`}>{serverError}</div>}
            {successMessage && <div className={`${styles["alert-profile"]} ${styles["alert-success-profile"]}`}>{successMessage}</div>}

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
