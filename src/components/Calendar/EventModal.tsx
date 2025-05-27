import React, { useState, useEffect } from "react";
import { FiCheck, FiTrash2, FiX } from "react-icons/fi";
import styles from "./Calendar.module.css";

interface Props {
  open: boolean;
  mode: "create" | "edit" | "delete";
  onClose: () => void;
  onSave: (data: { title: string; color: string }) => void;
  onDelete: () => void;
  initialTitle?: string;
  initialColor?: string;
}

const COLOR_OPTIONS = [
  "#b291ff", // purple
  "#ffaecb", // pink
  "#ff69b4", // hot pink
  "#f9e6f0", // soft
  "#87d68d", // green
  "#63b3ed", // blue
  "#fff176", // yellow
];

export default function EventModal({
  open,
  mode,
  onClose,
  onSave,
  onDelete,
  initialTitle = "",
  initialColor = "#ff69b4",
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setTitle(initialTitle);
    setColor(initialColor);
  }, [initialTitle, initialColor, open]);

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} title="סגור">
          <FiX size={24} />
        </button>
        <div className={styles.modalField}>
          <label>Event Title:</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="title..."
            autoFocus
          />
        </div>
        <div className={styles.modalField}>
          <label>Pick Color:</label>
          <div className={styles.colors}>
            {COLOR_OPTIONS.map(c => (
              <button
                key={c}
                className={styles.colorCircle}
                style={{
                  background: c,
                  border: c === color ? "2.5px solid #333" : "2px solid #fff"
                }}
                onClick={() => setColor(c)}
                aria-label={`pick color ${c}`}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className={styles.modalButtons}>
          <button
            className={styles.saveBtn}
            onClick={() => title && onSave({ title, color })}
            title="שמור"
            type="button"
            disabled={!title}
          >
            <FiCheck size={22} />
          </button>
          {mode === "edit" && (
            <button
              className={styles.deleteBtn}
              onClick={onDelete}
              title="מחק"
              type="button"
            >
              <FiTrash2 size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}