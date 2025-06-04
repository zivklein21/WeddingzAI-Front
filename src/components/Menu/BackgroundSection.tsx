// src/components/Menu/BackgroundSection.tsx
import React, { useState } from "react";
import styles from "./Menu.module.css";
import menuService from "../../services/menu-service";
import { ImMagicWand } from "react-icons/im";
import { FiLoader } from "react-icons/fi";
import { CiImageOn } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";

interface Props {
  userId: string;
  coupleNames: string;
  designPrompt: string;
  setDesignPrompt: (v: string) => void;
  backgroundUrl: string;
  setBackgroundUrl: (v: string) => void;
  onDone: () => void;
}

export default function BackgroundSection({
  userId,
  coupleNames,
  designPrompt,
  setDesignPrompt,
  backgroundUrl,
  setBackgroundUrl,
  onDone,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generate AI background
  const handleGenerate = async () => {
    if (!designPrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await menuService.generateBackground(designPrompt);
      setBackgroundUrl(response.data.backgroundUrl);
    } catch (err) {
      console.error("generateBackground failed:", err);
      alert("Error generating background");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDefault = () => {
    setBackgroundUrl("/images/def-bg.png");
  };
  
  const handleCreateMenu = async () => {
    const designPrompt = 'Elegant wedding menu background, white and gold, subtle floral style';
    console.log({ userId, coupleNames, designPrompt, backgroundUrl });
  if (!userId || !coupleNames || !designPrompt || !backgroundUrl) {
    alert("Missing details for menu creation");
    return;
  }
  setSaving(true);
  try {
    await menuService.createMenu(
      userId,
      coupleNames,
      designPrompt,
      backgroundUrl
    );
    onDone(); 
  } catch (err) {
    alert("Error creating menu");
    console.error("createMenu failed:", err);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className={styles.section}>
      <div className={styles.inputRow}>
        <textarea
          value={designPrompt}
          onChange={e => setDesignPrompt(e.target.value)}
          placeholder="Describe your menu background style..."
          className={styles.promptInput}
        />
        <div className={styles.actions}>
          <span onClick={handleGenerate} className={styles.icon}>
            {isLoading ? <FiLoader className={styles.spinner} /> : <ImMagicWand />}
          </span>
          <span className={styles.icon} onClick={handleUseDefault}>
            <CiImageOn />
          </span>
          {/* <label className={styles.icon} title="Upload custom image">
            <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
            <CiImageOn />
          </label> */}
        </div>
      </div>

      {backgroundUrl && (
        <div className={styles.previewContainer}>
          <img
            src={backgroundUrl}
            alt="Menu background"
            className={styles.menuImage}
          />
          <span
            onClick={handleCreateMenu}
            className={styles.icon}
            style={{
              opacity: saving ? 0.5 : 1,
              pointerEvents: saving ? "none" : "auto",
            }}
            title="Create menu and continue"
          >
            <IoCheckmarkOutline />
          </span>
        </div>
      )}
    </div>
  );
}