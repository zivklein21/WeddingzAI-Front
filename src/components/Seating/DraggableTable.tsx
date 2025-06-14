import React, { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import TableShape from "./Table";
import styles from "./DraggableTable.module.css";
import { unassignGuest } from "../../services/guest-service";
import { deleteTable } from "../../services/seating-service";
import * as Icons from "../../icons/index";

export type DraggableTableProps = {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  x: number;
  y: number;
  guests?: { _id?: string; fullName: string; numberOfGuests?: number }[];
  onGuestRemoved?: () => void; // optional callback for refreshing unassigned guests
  onTableDeleted?: (
    id: string,
    returnedGuests: {
      _id?: string;
      fullName: string;
      numberOfGuests?: number;
    }[]
  ) => void; // optional callback for table deletion
};

export default function DraggableTable({
  id,
  name,
  shape,
  capacity,
  x,
  y,
  guests = [],
  onGuestRemoved,
  onTableDeleted,
}: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const [showGuests, setShowGuests] = useState(false);
  const [guestList, setGuestList] = useState(guests);
  useEffect(() => {
    setGuestList(guests);
  }, [guests]);
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

  // Remove guest handler: uses API to unassign guest, update local state, then calls optional callback
  const handleRemoveGuest = async (guestId?: string) => {
    try {
      if (guestId) {
        await unassignGuest(guestId);
        // Update local guestList immediately
        setGuestList((prev) => prev.filter((g) => g._id !== guestId));
        if (onGuestRemoved) onGuestRemoved();
      }
    } catch (error) {
      console.error("Failed to remove guest:", error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      await deleteTable(id);
      if (onTableDeleted) onTableDeleted(id, guests);
      setShowGuests(false);
    } catch (error) {
      console.error("Failed to delete table:", error);
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
          guests={guestList}
        />
        {showGuests && (
          <>
            <span
              className={styles.iconTableDelete}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTable();
              }}
            >
              <Icons.DeleteIcon className="icon" title="Delete Table" />
            </span>
            <div className={styles.guestPopup}>
              <span
                className={styles.iconClose}
                onClick={() => setShowGuests(false)}
              >
                <Icons.CloseIcon className="icon" title="Close Table" />
              </span>
              <h4>Guests for {name}:</h4>
              <ul className={styles.guestList}>
                {guestList.length > 0 ? (
                  guestList.map((guest, index) => (
                    <li key={guest._id ?? index}>
                      <span style={{ fontWeight: "bold" }}>
                        {guest.fullName}
                      </span>
                      {guest.numberOfGuests && guest.numberOfGuests >= 1
                        ? ` ${guest.numberOfGuests}`
                        : ""}
                      <span
                        className={styles.iconRemove}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleRemoveGuest(guest._id);
                        }}
                      >
                        <Icons.DeleteIcon
                          className="icon"
                          title="Remove Guest"
                        />
                      </span>
                    </li>
                  ))
                ) : (
                  <li>No guests found</li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
