import React, { useState } from "react";
import styles from "./Menu.module.css";
import menuService from "../../services/menu-service";
import { ImMagicWand } from "react-icons/im";
import { FiLoader } from "react-icons/fi";
import {CiImageOn}from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";

interface Props {
  designPrompt: string;
  setDesignPrompt: (v: string) => void;
  backgroundUrl: string;
  setBackgroundUrl: (v: string) => void;
  onDone: () => void;
}

export default function BackgroundSection({
  designPrompt,
  setDesignPrompt,
  backgroundUrl,
  setBackgroundUrl,
  onDone,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!designPrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await menuService.generateBackground(designPrompt);
      const backgroundUrl = response.data.backgroundUrl;
      setBackgroundUrl(backgroundUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDefault = () => {
    setBackgroundUrl("/images/def-bg.png");
  };

  return (
    <div className={styles.section}>
      <div className={styles.inputRow}>
        <textarea
          value={designPrompt}
          onChange={(e) => setDesignPrompt(e.target.value)}
          placeholder="Describe your menu background style..."
          className={styles.promptInput}
        />

        <div className={styles.actions}>
          <span onClick={handleGenerate} className={styles.icon}>
            {isLoading ? <FiLoader className={styles.spinner} /> : <ImMagicWand />}
          </span>
          <span className={styles.icon} onClick={handleUseDefault}>
            <CiImageOn/>
          </span>
        </div>
      </div>
      {backgroundUrl && (
        <div className={styles.previewContainer}>
          <img
            src={backgroundUrl}
            alt="Menu background"
            className={styles.menuImage}
          />
          <span onClick={onDone} className={styles.icon}>
            <IoCheckmarkOutline />
          </span>
        </div>
      )}
    </div>
  );
}