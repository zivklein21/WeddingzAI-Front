import React, { useState } from "react";
import styles from "./Table.module.css";

export type TableProps = {
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  onDelete?: () => void;
  onRotate?: () => void;
  rotation?: number;
  guests?: { fullName: string; numberOfGuests?: number }[];
  onClick?: () => void;
};

export default function TableShape({
  name,
  shape,
  capacity,
  onDelete,
  onRotate,
  rotation = 0,
  guests = [],
  onClick,
}: TableProps) {
  const baseSize = 40;
  const factor = 6;
  const size = baseSize + capacity * factor;

  const width = shape === "rectangle" ? size * 1.5 : size;
  const height = size;
  const borderRadius =
    shape === "round" ? "50%" : shape === "square" ? "8px" : "4px";

  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div className={styles.tableWrapper}>
      {onDelete && (
        <button className={styles.deleteButton} onClick={onDelete}>
          ✕
        </button>
      )}
      {onRotate && shape === "rectangle" && (
        <button
          className={styles.deleteButton}
          style={{ top: "-8px", left: "-8px", right: "auto" }}
          onClick={onRotate}
        >
          ↻
        </button>
      )}
      <div className={styles.tableShape} style={style} onClick={onClick}>
        {name}
      </div>
    </div>
  );
}
