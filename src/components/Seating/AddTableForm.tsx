import { useState } from "react";
import { createTable } from "../../services/seating-service";
import styles from "./AddTableForm.module.css";
import * as Icons from "../../icons/index";
type Props = {
  onTableCreated: (table: any) => void;
};

export default function AddTableForm({ onTableCreated }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [shape, setShape] = useState<"round" | "rectangle" | "square">("round");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTable = await createTable({
        name,
        shape,
        capacity,
        position: { x: 100, y: 100 },
      });

      onTableCreated(newTable);
      setShowForm(false);
      setName("");
    } catch (err) {
      console.error("שגיאה ביצירת שולחן:", err);
    }
  };

  return (
    <div>
      <span className={styles.icon} onClick={() => setShowForm(true)}>
        <Icons.AddIcon />
      </span>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.header}>
              <h3 className={styles.formTitle}>Create New Table</h3>
              <span
                className={styles.iconClose}
                onClick={() => setShowForm(false)}
              >
                <Icons.CloseIcon className="icon" />
              </span>
            </div>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="tableName" className={styles.label}>
                  Table Name
                </label>
                <input
                  id="tableName"
                  type="text"
                  placeholder="Enter table name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label htmlFor="shape" className={styles.label}>
                    Shape
                  </label>
                  <select
                    id="shape"
                    value={shape}
                    onChange={(e) => setShape(e.target.value as any)}
                    className={styles.select}
                  >
                    <option value="round">Round</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="square">square</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="capacity" className={styles.label}>
                    Seats
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    placeholder="Number of seats"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    required
                    className={styles.number}
                  />
                </div>
              </div>

              <span className={styles.buttonRight} onClick={handleSubmit}>
                <Icons.SaveIcon className="icon" />
              </span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
