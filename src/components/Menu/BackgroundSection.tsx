import { useState } from "react";
import styles from "./Menu.module.css";
import menuService from "../../services/menu-service";
import { ImMagicWand } from "react-icons/im";
import { FiLoader } from "react-icons/fi";
import { CiImageOn } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";
import { useAuth } from "../../hooks/useAuth/AuthContext";

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
  const { user } = useAuth();
  const userId = user?._id || "";
  const coupleNames = `${user?.firstPartner || ""} & ${user?.secondPartner || ""}`;
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
    console.log({ userId, coupleNames, designPrompt, backgroundUrl });
    if(!designPrompt) {
      designPrompt = "generic";
    }
    // if (!userId || !coupleNames.trim() || !designPrompt.trim() || !backgroundUrl.trim()) {
    if (!userId || !coupleNames.trim() || !designPrompt.trim()) {
      alert("Missing required fields");
      return;
    }
    setSaving(true);
    backgroundUrl = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-D9CwkcHJJw81xe0R8WtjE3jB/user-VpsbB7hOOGeE1QBUPbcvs0gg/img-7v56xfQ8Mx7dD8Scv9gLNP6D.png?st=2025-06-05T10%3A20%3A50Z&se=2025-06-05T12%3A20%3A50Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-04T20%3A56%3A14Z&ske=2025-06-05T20%3A56%3A14Z&sks=b&skv=2024-08-04&sig=rTjsMGVMGCaiSiip5IMSwLtCvMC1mTZfURpiiX4QTL0%3D";
    try {
      await menuService.createMenuWithBackground({
        userId,
        coupleNames,
        designPrompt,
        backgroundUrl,
      });
      onDone();
    } catch (error) {
      alert("Error creating menu");
      console.error(error);
    } finally {
      setSaving(false);
    }
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
            <CiImageOn />
          </span>
        </div>
      </div>

      {backgroundUrl && (
        <div className={styles.previewContainer}>
          <img
            src={backgroundUrl}
            alt="Menu background"
            className={styles.menuImage}
            onError={() => {
              alert("Failed to load background image.");
              setBackgroundUrl("");
            }}
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