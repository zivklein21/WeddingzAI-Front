import { useState } from "react";
import styles from "./Menu.module.css";
import menuService from "../../services/menu-service";
import * as Icons from "../../icons/index";
import {toast} from "react-toastify";

interface Props {
  userId: string;
  designPrompt: string;
  setDesignPrompt: (v: string) => void;
  coupleNames: string;
  backgroundUrl: string; // הנתיב היחסי או URL מלא מה-db
  setBackgroundUrl: (v: string) => void;
  onDone: () => void;
}

export default function BackgroundSection({
  userId,
  designPrompt,
  setDesignPrompt,
  coupleNames,
  backgroundUrl: initialBackgroundUrl,
  setBackgroundUrl: setParentBackgroundUrl,
  onDone,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<"existing" | "generated" | null>(null);

  const baseUrl = import.meta.env.VITE_BASE_URL || "";

  // בניית ה-URL לתמונה הקיימת (אם יש)
  const existingFullUrl = initialBackgroundUrl
    ? (initialBackgroundUrl.startsWith("http")
        ? initialBackgroundUrl
        : `${baseUrl}/${initialBackgroundUrl.replace(/^\/+/, "")}`)
    : null;

  // Generate new image from AI
  const handleGenerate = async () => {
    if (!designPrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await menuService.generateBackground(designPrompt);
      toast.info("Generate Background...");
      const genUrl = response.data.backgroundUrl;
      setGeneratedImageUrl(genUrl);
      setSelectedImage("generated"); 
    } catch (err) {
      console.error("generateBackground failed:", err);
      toast.error("Error generating background");
    } finally {
      setIsLoading(false);
    }
  };

  // כשמשתמש בוחר להמשיך עם תמונה קיימת
  const handleContinueWithExisting = () => {
    if (!existingFullUrl) {
      toast.warn("No existing background to use");
      return;
    }
    setParentBackgroundUrl(existingFullUrl);
    setSelectedImage("existing");
    onDone();
  };

  // כשמשתמש בוחר להמשיך עם תמונה חדשה
  const handleContinueWithGenerated = async () => {
    if (!generatedImageUrl) {
      toast.warn("No generated image to save");
      return;
    }
    if (!userId || !coupleNames.trim() || !designPrompt.trim()) {
      toast.info("Missing required fields");
      return;
    }
    try {
      await menuService.createMenuWithBackground({
        userId,
        coupleNames,
        designPrompt,
        backgroundUrl: generatedImageUrl,
      });
      setParentBackgroundUrl(generatedImageUrl);
      setSelectedImage("generated");
      onDone();
    } catch (error) {
      console.error(error);
      toast.error("Error creating menu");
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
        <span
          onClick={handleGenerate}
          className="icon"
          
        >
          {isLoading ? <Icons.LoaderIcon className="spinner" /> : <Icons.MagicIcon title="Generate AI Background"/>}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 24,
          justifyContent: "center",
        }}
      >
        {/* Existing Image Section */}
        {existingFullUrl && (
          <div
            style={{
              border: selectedImage === "existing" ? "3px solid #d2b1e5e1" : "1px solid #ccc",
              borderRadius: 12,
              padding: 8,
              textAlign: "center",
              maxWidth: 250,
            }}
          >
            <img
              src={existingFullUrl}
              alt="Existing background"
              style={{ maxWidth: "100%", borderRadius: 8 }}
            />
            <span
              onClick={handleContinueWithExisting}
              className="icon"
              style={{ marginTop: 8 }}
            >
              <Icons.CheckIcon title="Keep With Old"/>
            </span>
          </div>
        )}

        {/* Generated Image Section */}
        {generatedImageUrl && (
          <div
            style={{
              border: selectedImage === "generated" ? "3px solid #d2b1e5e1" : "1px solid #ccc",
              borderRadius: 12,
              padding: 8,
              textAlign: "center",
              maxWidth: 250,
            }}
          >
            <img
              src={generatedImageUrl}
              alt="Generated background"
              style={{ maxWidth: "100%", borderRadius: 8 }}
            />
            <span
              onClick={handleContinueWithGenerated}
              style={{ marginTop: 8 }}
              className="icon"
            >
              <Icons.CheckIcon title="Keep With New"/>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}