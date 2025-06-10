import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";
import * as Icons from "../../icons/index";

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
        <span className={styles.closeBtn} onClick={onClose} >
          <Icons.CloseIcon className="icon" title="Close Event"/>
        </span>
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
          <span
            className="icon"
            onClick={() => title && onSave({ title, color })}
            
          >
            <Icons.SaveIcon title="Save Event"/>
          </span>
          {mode === "edit" && (
            <span
              className="icon"
              onClick={onDelete}
              
            >
              <Icons.DeleteIcon title="Delete Event"/>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}