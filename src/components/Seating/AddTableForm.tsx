import { useState } from "react";
import { createTable } from "../../services/seating-service";

type Props = {
  onTableCreated: (table: any) => void;
};

export default function AddTableForm({ onTableCreated }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [shape, setShape] = useState<"round" | "rectangle">("round");

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
    <div style={{ margin: "1rem 0" }}>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "ביטול" : "הוסף שולחן חדש"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="שם השולחן"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value as any)}
          >
            <option value="round">עגול</option>
            <option value="rectangle">מלבני</option>
          </select>
          <input
            type="number"
            placeholder="מספר מקומות"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            min={1}
            required
          />
          <button type="submit">צור שולחן</button>
        </form>
      )}
    </div>
  );
}
