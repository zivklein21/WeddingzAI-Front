import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import defaultAvatar from "../../assets/images/user-icon.svg";

// Services
import fileService from "../../services/file-service";
import authService from "../../services/auth-service";
import tdlService from "../../services/tdl-service";
import { useAuth } from "../../hooks/useAuth/AuthContext";

// Icons
import * as Icons from "../../icons/index";

// Style
import "react-datepicker/dist/react-datepicker.css";
import styles from "./PersonalDetails.module.css";

interface UserDetails {
  email: string;
  firstPartner: string;
  secondPartner: string;
  weddingVenue: string;
  weddingDate: Date | null;
  avatar: string;
}

const PersonalDetails: React.FC = () => {
  const { user, updateUserSession } = useAuth();
  const [details, setDetails] = useState<UserDetails>({
    email: "",
    firstPartner: "",
    secondPartner: "",
    weddingVenue: "",
    weddingDate: null,
    avatar: defaultAvatar,
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setDetails({
        email: user.email || "",
        firstPartner: user.firstPartner || "",
        secondPartner: user.secondPartner || "",
        weddingVenue: user.weddingVenue || "",
        weddingDate: user.weddingDate ? new Date(user.weddingDate) : null,
        avatar: user.avatar?.trim() ? user.avatar : defaultAvatar,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((d) => ({ ...d, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setDetails((d) => ({ ...d, weddingDate: date }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setNewAvatar(f);
      setDetails((d) => ({
        ...d,
        avatar: URL.createObjectURL(f),
      }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let avatarUrl = details.avatar;
    if (newAvatar) {
      try {
        const resp = await fileService.uploadImageFile(newAvatar);
        avatarUrl = resp.data.url;
      } catch {
        toast.error("Failed to upload avatar.");
        return;
      }
    }

    const payload = {
      ...details,
      avatar: avatarUrl,
      weddingDate: details.weddingDate
        ? details.weddingDate.toISOString().slice(0, 10)
        : "",
    };

    try {
      const { request } = await authService.updateUser(payload);
      const res = await request;
      if (res.status === 200) {
        if (user?.weddingDate !== payload.weddingDate && payload.weddingDate) {
          try {
            await tdlService.updateWeddingDate(payload.weddingDate);
          } catch {
            toast.warn("Saved, but couldn't sync wedding date.");
          }
        }
        updateUserSession({ ...user, ...payload });
        setNewAvatar(null);
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Error updating profile.");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.info("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { request: resetPasswordRequest } = await authService.resetPassword(password);
      const resetResponse = await resetPasswordRequest;
      if (resetResponse.status === 200) {
        toast.success("Password reset successfully!");
        return;
      }
      toast.error("Failed to reset password.");

    } catch (error: any) {
      toast.error("An error occurred while updating password.");
      console.error(error.response?.data?.message || "An error occurred while updating password.");
      return;
    }
  }


  return (
    <div className={styles.container}>
      {/* Avatar */}
      <div className={styles.avatarSection}>
        <div
          className={styles.avatarPlaceholder}
          style={{ backgroundImage: `url(${details.avatar})` }}
        />
        <span
          className="icon"
          onClick={() => fileRef.current?.click()}
        >
          <Icons.ImageIcon/>
        </span>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Form */}
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        {/* Email */}
        <div className={styles.fullWidth}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={details.email}
            onChange={handleChange}
          />
        </div>

        {/* Partners */}
        <div className={styles.partnerRow}>
          <div>
            <label>First Partner</label>
            <input
              name="firstPartner"
              value={details.firstPartner}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Second Partner</label>
            <input
              name="secondPartner"
              value={details.secondPartner}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Venue + Date */}
        <div className={styles.venueDateRow}>
          <div>
            <label>Wedding Venue</label>
            <input
              name="weddingVenue"
              value={details.weddingVenue}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Wedding Date</label>
            <div className={styles.datePickerWrapper}>
              <DatePicker
                selected={details.weddingDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className={styles.dateInput}
                wrapperClassName={styles.datePickerWrapper}
              />
              <span
                className="icon"
                onClick={handleSubmit}
              >
                <Icons.SaveIcon/>
              </span>
            </div>
          </div>
        </div>
      </form>
      <br></br>
      <br></br>
      <form className={styles.passwordGrid} >
        <div className={styles.venueDateRow}>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>ConfirmPassword</label>
              <div className={styles.datePickerWrapper}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="icon"
                  onClick={handlePasswordReset}
                >
                  <Icons.SaveIcon/>
                </span>
              </div>
            </div>
        </div>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default PersonalDetails;