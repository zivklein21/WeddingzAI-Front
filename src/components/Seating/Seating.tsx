// src/components/Seating/Seating.tsx

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import DraggableTable from "./DraggableTable";
import AddTableForm from "./AddTableForm";
import UnassignedGuestList from "./UnassignedGuestList";

import { getMyTables, updateTable } from "../../services/seating-service";
import { fetchMyGuests } from "../../services/guest-service";
import { Guest } from "../../types/guest";

import styles from "./Seating.module.css";
import * as Icons from "../../icons/index";

import { useNavigate } from "react-router-dom";

export type Table = {
  _id: string;
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  position: { x: number; y: number };
  guests: { _id?: string; fullName: string; numberOfGuests?: number }[];
};

export default function Seating() {
  const [tables, setTables] = useState<Table[]>([]);
  const [unassignedGuests, setUnassignedGuests] = useState<Guest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // on component mount, load both tables and unassigned guests
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
        // filter out those already assigned to a table
        const unassigned = data.filter((g) => !g.tableId);
        setUnassignedGuests(unassigned);
      } catch (err) {
        console.error("Error loading unassigned guests:", err);
      }
    };

    fetchTables();
    fetchGuests();
  }, []);

  // Refresh the “unassignedGuests” list after any guest is moved back
  const refreshUnassignedGuests = async () => {
    try {
      const data = await fetchMyGuests();
      const unassigned = data.filter((g) => !g.tableId);
      setUnassignedGuests(unassigned);
    } catch (err) {
      console.error("Error refreshing unassigned guests:", err);
    }
  };

  // When a table is dragged, update its position both locally and via API
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

  // Reload all tables from the server
  const refreshTables = async () => {
    try {
      const data = await getMyTables();
      setTables(data);
    } catch (err) {
      console.error("Error refreshing tables:", err);
    }
  };

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
    <div className="pageMain">
      <div className="pageContainer">
        <Icons.BackArrowIcon
          className="backIcon"
          onClick={() => navigate(-1)}
          title="Go Back"
        />
        <h2 className="pageHeader">Seating Chart</h2>
        <div className={styles.contentGrid}>
          <div className={styles.sidebar}>
            <UnassignedGuestList
              guests={unassignedGuests}
              refreshGuests={refreshUnassignedGuests}
              refreshTables={refreshTables}
              updateLocalTableGuests={updateLocalTableGuests}
            />
          </div>

          <div className={styles.canvas}>
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
                  onTableDeleted={(deletedId) => {
                    // Remove the deleted table
                    setTables((prev) =>
                      prev.filter((t) => t._id !== deletedId)
                    );
                    // Refresh the unassigned guests list from server
                    refreshUnassignedGuests();
                  }}
                />
              ))}
            </DndContext>

            <AddTableForm
              onTableCreated={(newTable) =>
                setTables((prev) => [...prev, newTable])
              }
            />
          </div>
        </div>
        {/* <ToastContainer position="bottom-right"/> */}
      </div>
    </div>
  );
}
