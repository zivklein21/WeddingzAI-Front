import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "./ProfileForm.module.css";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import defaultAvatar from "../../assets/images/user-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import fileService from "../../services/file-service";
import authService from "../../services/auth-service";
import tdlService from "../../services/tdl-service";
import { Vendor } from "../../types/Vendor";
import vendorService from "../../services/vendor-service";


interface UserDetails {
  email: string;
  firstPartner: string;
  secondPartner: string;
  avatar: string;
  weddingDate: string;
  weddingVenue: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    email: "",
    firstPartner: "",
    secondPartner: "",
    avatar: defaultAvatar,
    weddingDate: "",
    weddingVenue: "",
  });

  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUserSession } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [passServerError, setPassServerError] = useState<string | null>(null);
  const [passSuccessMessage, setPassSuccessMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const [bookedVendors, setBookedVendors] = useState<Vendor[]>([]);

  // Functions
  // Fetch booked vendors from the service
  const fetchVendors = async () => {
    try {
      const bookedVendors = await vendorService.fetchBookedVendors();
      setBookedVendors(bookedVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // Fetch user premium status from the service
  const fetchPremiumStatus = async () => {
    try {
      const { request: getPremiumStatusRequest } = await authService.getUserPremiumStatus();
      const response = await getPremiumStatusRequest;
      if (response.status === 200) {
        console.log("User Premium Status:", response.data.is_premium);
        setIsPremium(response.data.is_premium);
      }
    } catch (error) {
      console.error("Error fetching premium status:", error);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatarFile(file); // keep reference to file
      const previewUrl = URL.createObjectURL(file);
      setUserDetails((prev) => ({ ...prev, avatar: previewUrl }));
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Handle cancel booking for a vendor
  const handleCancelBooking = async (vendorId: string, vendorName: string) => {
    try {
      await vendorService.cancelBookedVendor(vendorId);
      fetchVendors();
      toast.success("Successfully canceled booking for " + vendorName);
    } catch (error) {
      toast.error("Failed to cancel booking for " + vendorName);
      console.error("Error canceling vendor booking:", error);
    }
  };

  // Handle form submission
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

        // ✅ Update TDL wedding date if changed
        if (user?.weddingDate !== updatedDetails.weddingDate) {
          try {
            await tdlService.updateWeddingDate(updatedDetails.weddingDate);
          } catch (err) {
            console.error("Failed to update TDL wedding date:", err);
            setServerError("Profile updated, but failed to sync wedding date.");
          }
        }

      } else {
        setServerError("Failed to update profile.");
      }

    } catch (error: any) {
      setServerError(error.response?.data?.message || "An error occurred while updating the profile.");
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPassServerError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setPassServerError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { request: resetPasswordRequest } = await authService.resetPassword(password);
      const resetResponse = await resetPasswordRequest;
      if (resetResponse.status === 200) {
        setPassSuccessMessage("Password reset successfully!");
        return;
      }
      setPassServerError("Failed to reset password.");

    } catch (error: any) {
      setPassServerError(error.response?.data?.message || "An error occurred while updating password.");
      return;
    }

    setPassServerError(null);
    setPassSuccessMessage(`Password reset successfully!`);
  }

  // Fetch user details and premium status on mount
  useEffect(() => {
    if (user) {
      setUserDetails({
        email: user.email || "",
        firstPartner: user.firstPartner || "",
        secondPartner: user.secondPartner || "",
        weddingDate: user.weddingDate || "",
        weddingVenue: user.weddingVenue || "",
        avatar:
          user.avatar && user.avatar.trim() !== ""
            ? user.avatar.startsWith("/uploads/")
              ? user.avatar
              : user.avatar
            : defaultAvatar,
      });
    }

    const abortController = new AbortController();

    fetchPremiumStatus();
    fetchVendors();

    return () => {
      abortController.abort();
    };
  }, [user]);

  return (
    <div className={styles.main}>
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>Your Profile</h2>
        <p className={styles.profileSubtitle}>Edit your personal info</p>

        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.avatarSection}
            style={{
              marginLeft: "0.8rem",
            }}>
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

            <div className={styles.infoItem}>
              <label>Wedding Date</label>
              <input
                type="text"
                name="weddingDate"
                value={userDetails.weddingDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.infoItem}>
              <label>Wedding Venue</label>
              <input
                type="text"
                name="weddingVenue"
                value={userDetails.weddingVenue}
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

        <br />

        {/* Booked Vendors Section */}
        <div className={`${styles.card} ${styles.bookedVendorsTableWrapper}`}>
          {bookedVendors.length === 0 ? (
            <p className={styles.noVendorsMsg}>No vendors booked yet.</p>
          ) : (
            <table className={styles.bookedVendorsTable}>
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Vendor Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookedVendors.map((item, index) => (
                  <tr key={index}>
                    <td>{item.vendor?.name || "Unnamed Vendor"}</td>
                    <td>{item.vendorType}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancelBooking(item.vendor?._id || "", item.vendor?.name || "Unnamed Vendor")}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <br />

        {/* Password Reset Section */}
        <div className={styles.card}
          style={{
            justifyContent: "center",
          }}>
          <form
            className={styles.infoSection}
            onSubmit={handlePasswordReset}
          >
            <h3 style={{ marginBottom: "1rem", color: "#2e2e2e", textAlign: "left" }}>Reset Password</h3>

            <div className={styles.infoItem}
              style={{
                width: "95%",
              }}>
              <label>New Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.infoItem}
              style={{
                width: "95%",
              }}>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {passServerError && <div className={`${styles["alert-profile"]} ${styles["alert-danger-profile"]}`}>{passServerError}</div>}
            {passSuccessMessage && <div className={`${styles["alert-profile"]} ${styles["alert-success-profile"]}`}>{passSuccessMessage}</div>}

            <button type="submit" className={styles.updateBtn} style={{ width: "105%" }}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
    
  );
};

export default Profile;
