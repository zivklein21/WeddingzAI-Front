import { useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import DraggableTable from "../../components/Seating/DraggableTable";
import styles from "./SeatingPage.module.css";
import AddTableForm from "../../components/Seating/AddTableForm";
import { getMyTables, updateTable } from "../../services/seating-service";

type Table = {
  _id: string;
  name: string;
  position: { x: number; y: number };
};

export default function SeatingPage() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await getMyTables();
        setTables(data);
        console.log(data);
      } catch (err) {
        console.error("שגיאה בטעינת השולחנות:", err);
      }
    };
    fetchTables();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;

    setTables((prev) => {
      const updated = prev.map((table) =>
        table._id === active.id
          ? {
              ...table,
              position: {
                x: table.position.x + delta.x,
                y: table.position.y + delta.y,
              },
            }
          : table
      );

      const moved = updated.find((t) => t._id === active.id);
      if (moved) {
        updateTable(moved._id, {
          position: {
            x: moved.position.x,
            y: moved.position.y,
          },
        }).catch((err) => {
          console.error("שגיאה בשמירת מיקום שולחן:", err);
        });
      }

      return updated;
    });
  };

  return (
    <div className={styles.canvas}>
      <DndContext onDragEnd={handleDragEnd}>
        {tables.map((table) => (
          <DraggableTable
            key={table._id}
            id={table._id}
            name={table.name}
            x={table.position.x}
            y={table.position.y}
          />
        ))}
      </DndContext>
      <AddTableForm
        onTableCreated={(newTable) => setTables((prev) => [...prev, newTable])}
      />
    </div>
  );
}
