import React from "react";
import { useDraggable } from "@dnd-kit/core";
import TableShape, { TableProps } from "./Table";
import styles from "../../pages/SeatingPage/SeatingPage.module.css";

export type DraggableTableProps = {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  x: number;
  y: number;
};

export default function DraggableTable({
  id,
  name,
  shape,
  capacity,
  x,
  y,
}: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  // חישוב מיקום סופי (initial + drag delta)
  const translateX = transform ? x + transform.x : x;
  const translateY = transform ? y + transform.y : y;

  const style: React.CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px)`,
    position: "absolute",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TableShape name={name} shape={shape} capacity={capacity} />
    </div>
  );
}
