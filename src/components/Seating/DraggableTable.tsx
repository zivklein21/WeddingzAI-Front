import React, { useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import TableShape from "./Table";
import styles from "./DraggableTable.module.css";

export type DraggableTableProps = {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  x: number;
  y: number;
  guests?: { fullName: string; numberOfGuests?: number }[];
};

export default function DraggableTable({
  id,
  name,
  shape,
  capacity,
  x,
  y,
  guests = [],
}: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const [showGuests, setShowGuests] = useState(false);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);
  const DRAG_THRESHOLD = 5; // pixels

  const translateX = transform ? x + transform.x : x;
  const translateY = transform ? y + transform.y : y;

  const style: React.CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px)`,
    position: "absolute",
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerDownPos.current && !didDrag.current) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > DRAG_THRESHOLD) {
        didDrag.current = true;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerDownPos.current) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (!didDrag.current && distance < DRAG_THRESHOLD) {
        setShowGuests((prev) => !prev);
      }
      pointerDownPos.current = null;
      didDrag.current = false;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ position: "relative" }}
      >
        <TableShape
          name={name}
          shape={shape}
          capacity={capacity}
          guests={guests}
        />
        {showGuests && guests && guests.length > 0 && (
          <div className={styles.guestPopup}>
            <button
              className={styles.closeButton}
              onClick={() => setShowGuests(false)}
            >
              ✕
            </button>
            <h4 style={{ margin: "0 0 6px 0" }}>Guests for {name}:</h4>
            <ul className={styles.guestList}>
              {guests.map((guest, index) => (
                <li key={index}>
                  <span style={{ fontWeight: "bold" }}>{guest.fullName}</span>
                  {guest.numberOfGuests && guest.numberOfGuests > 1
                    ? ` +${guest.numberOfGuests - 1}`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
