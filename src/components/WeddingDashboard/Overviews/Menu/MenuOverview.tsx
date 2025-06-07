import React, { useEffect, useState } from "react";
import menuService from "../../../../services/menu-service";
import { useAuth } from "../../../../hooks/useAuth/AuthContext";
import styles from "./MenuOverview.module.css";

interface Props {
  altText?: string;
}

export default function MenuOverview({
  altText = "Final Menu",
}: Props) {
    const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useAuth();
    const userId = user.user?._id;
  useEffect(() => {
  async function fetchFinalImage() {
    if (!userId) return; // לא קיים userId, לא עושים כלום

    try {
      setLoading(true);
      const res = await menuService.getMenuByUserId(userId);
      if (res?.data?.finalPng) {
        setFinalImageUrl(res.data.finalPng);
      } else {
        setFinalImageUrl(null);
      }
    } catch (e) {
      setError("Failed to load final menu image.");
      setFinalImageUrl(null);
    } finally {
      setLoading(false);
    }
  }
  fetchFinalImage();
}, [userId]);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>{error}</div>;
  if (!finalImageUrl) return <div>No final menu image found.</div>;
    
  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  const newUrl = `${baseUrl}/${finalImageUrl.replace(/^\/+/, "")}`
  return (
      <img
        src={newUrl}
        alt={altText}
        className={styles.img}
      />
  );
}