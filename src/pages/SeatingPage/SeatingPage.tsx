import { useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import DraggableTable from "../../components/Seating/DraggableTable";
import styles from "./SeatingPage.module.css";
import AddTableForm from "../../components/Seating/AddTableForm";
import { getMyTables, updateTable } from "../../services/seating-service";
import { NavBar } from "../../components/NavBar/NavBar";
import UnassignedGuestList from "../../components/Seating/UnassignedGuestList";
import { fetchMyGuests } from "../../services/guest-service";
import { Guest } from "../../types/guest";

export type Table = {
  _id: string;
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  position: { x: number; y: number };
  guests: { _id?: string; fullName: string; numberOfGuests?: number }[];
};

export default function SeatingPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [unassignedGuests, setUnassignedGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await getMyTables();
        setTables(data);
      } catch (err) {
        console.error("Error loading tables:", err);
      }
    };

    const fetchGuests = async () => {
      try {
        const data = await fetchMyGuests();
        const unassigned = data.filter((g) => !g.tableId);
        setUnassignedGuests(unassigned);
      } catch (err) {
        console.error("Error loading unassigned guests:", err);
      }
    };

    fetchTables();
    fetchGuests();
  }, []);

  const refreshUnassignedGuests = async () => {
    try {
      const data = await fetchMyGuests();
      const unassigned = data.filter((g) => !g.tableId);
      setUnassignedGuests(unassigned);
    } catch (err) {
      console.error("Error refreshing unassigned guests:", err);
    }
  };

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
          position: { x: moved.position.x, y: moved.position.y },
        }).catch((err) => {
          console.error("Error saving table position:", err);
        });
      }
      return updated;
    });
  };

  const refreshTables = async () => {
    try {
      const data = await getMyTables();
      setTables(data);
    } catch (err) {
      console.error("Error refreshing tables:", err);
    }
  };

  // Add updateLocalTableGuests function to update local table guests array
  const updateLocalTableGuests = (tableId: string, guest: Guest) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table._id === tableId
          ? { ...table, guests: [...table.guests, guest] }
          : table
      )
    );
  };

  return (
    <div className={styles.canvas}>
      <NavBar />
      <UnassignedGuestList
        guests={unassignedGuests}
        refreshGuests={refreshUnassignedGuests}
        refreshTables={refreshTables}
        updateLocalTableGuests={updateLocalTableGuests}
      />
      <DndContext onDragEnd={handleDragEnd}>
        {tables.map((table) => (
          <DraggableTable
            key={table._id}
            id={table._id}
            name={table.name}
            shape={table.shape}
            capacity={table.capacity}
            x={table.position.x}
            y={table.position.y}
            guests={table.guests}
            onGuestRemoved={refreshUnassignedGuests}
          />
        ))}
      </DndContext>
      <AddTableForm
        onTableCreated={(newTable) => setTables((prev) => [...prev, newTable])}
      />
    </div>
  );
}
