import { useEffect, useState } from "react";
import invitationService from "../../../../services/invitation-service";
import { useAuth } from "../../../../hooks/useAuth/AuthContext";
import styles from "./InvitationOverview.module.css";
import * as Icons from "../../../../icons/index";
interface Props {
  altText?: string;
}

export default function InvitationOverview({ altText = "Final Menu" }: Props) {
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    async function fetchFinalImage() {
      if (!userId) {
        setError("No user found.");
        setFinalImageUrl(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await invitationService.getInvitationByUserId(userId);

        if (res?.data?.finalPng) {
          setFinalImageUrl(res.data.finalPng);
        } else {
          setFinalImageUrl(null);
        }
      } catch (err) {
        console.error("Failed to load invitation:", err);
        setError("Failed to load final invitation image.");
        setFinalImageUrl(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFinalImage();
  }, [userId]);

  if (loading) {
    return <div className={styles.imgLoading}><Icons.LoaderIcon className="spinner"/></div>;
  }

  if (error) {
    return <div className={styles.imgError}><Icons.ErrorIcon className="errorIcon"/></div>;
  }

  if (!finalImageUrl) {
    return <div className={styles.imgNotFound}><Icons.NoImgIcon className="icon"/></div>;
  }

  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  const newUrl = `${baseUrl}/${finalImageUrl.replace(/^\/+/, "")}`;

  return (
    <img src={newUrl} alt={altText} className={styles.img} />
  );
}