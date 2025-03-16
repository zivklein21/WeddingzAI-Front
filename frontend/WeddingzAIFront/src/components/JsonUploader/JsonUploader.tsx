import { useState } from "react";
import styles from "./JsonUploader.module.css";

export default function JsonUploader() {
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/json") {
      setFileError("Please upload a valid JSON file.");
      setFileName(null);
      setFile(null);
      return;
    }

    setFileName(selectedFile.name);
    setFileError(null);
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) {
      setFileError("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        JSON.parse(e.target?.result as string);
        setFileError(null);
        alert("Valid JSON file uploaded.");
      } catch {
        setFileError("Invalid JSON format.");
        setFileName(null);
        setFile(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.centerContainer}>
      <div className={styles.jsonUploaderContainer}>
        <h2>Upload a JSON File</h2>
        <p>Select a JSON file to validate its format.</p>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button className={styles.uploadButton} onClick={handleSubmit}>Submit</button>
        {fileName && <p className={styles.successMessage}>Uploaded: {fileName}</p>}
        {fileError && <p className={styles.errorMessage}>{fileError}</p>}
      </div>
    </div>
  );
}
