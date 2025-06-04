import React, { useMemo } from "react";
import { FaChair } from "react-icons/fa";
import styles from "./Table.module.css";

export type TableProps = {
  name: string;
  shape: "round" | "rectangle" | "square";
  capacity: number;
  guests?: { fullName: string; numberOfGuests?: number }[];
  onDelete?: () => void;
  onRotate?: () => void;
  rotation?: number;
  onClick?: () => void;
};

export default function Table({
  name,
  shape,
  capacity,
  guests = [],
  onDelete,
  onRotate,
  rotation = 0,
  onClick,
}: TableProps) {
  const usedSeats = guests.reduce(
    (sum, g) => sum + (g.numberOfGuests !== undefined ? g.numberOfGuests : 1),
    0
  );

  
  const baseSize = 20;
  const factor = 6;
  const size = baseSize + capacity * factor; 

  const width = shape === "rectangle" ? size * 1.5 : size;
  const height = size;
  const borderRadius =
    shape === "round" ? "50%" : shape === "square" ? "8px" : "4px";

  
  const chairSize = 20;   
  const chairOffset = 5;  
  const tableRadius = Math.max(width, height) / 2;
  const radius = shape === "round"
    ? tableRadius + chairOffset
    : 0; 

  const chairPositions = useMemo(() => {
    const arr: Array<{ left: number; top: number; rotationDeg: number }> = [];

    if (shape === "round") {
      for (let i = 0; i < capacity; i++) {
        const angle = (2 * Math.PI * i) / capacity - Math.PI / 2;
        const cx = radius * Math.cos(angle);
        const cy = radius * Math.sin(angle);
        const rotationDeg = (angle * 180) / Math.PI + 90;
        arr.push({ left: cx, top: cy, rotationDeg });
      }
    } else {
      const baseCount = Math.floor(capacity / 4);
      const remainder = capacity % 4;
      const topCount = baseCount + (remainder > 0 ? 1 : 0);
      const rightCount = baseCount + (remainder > 1 ? 1 : 0);
      const bottomCount = baseCount + (remainder > 2 ? 1 : 0);
      const leftCount = baseCount;

      const halfW = width / 2;
      const halfH = height / 2;

      if (topCount > 0) {
        const spacing = width / (topCount + 1);
        for (let i = 0; i < topCount; i++) {
          const cx = -halfW + spacing * (i + 1);
          const cy = -halfH - chairOffset;
          arr.push({ left: cx, top: cy, rotationDeg: 0 });
        }
      }

      if (rightCount > 0) {
        const spacing = height / (rightCount + 1);
        for (let i = 0; i < rightCount; i++) {
          const cy = -halfH + spacing * (i + 1);
          const cx = halfW + chairOffset;
          arr.push({ left: cx, top: cy, rotationDeg: 90 });
        }
      }

      if (bottomCount > 0) {
        const spacing = width / (bottomCount + 1);
        for (let i = 0; i < bottomCount; i++) {
          const cx = -halfW + spacing * (i + 1);
          const cy = halfH + chairOffset;
          arr.push({ left: cx, top: cy, rotationDeg: 180 });
        }
      }

      if (leftCount > 0) {
        const spacing = height / (leftCount + 1);
        for (let i = 0; i < leftCount; i++) {
          const cy = -halfH + spacing * (i + 1);
          const cx = -halfW - chairOffset;
          arr.push({ left: cx, top: cy, rotationDeg: 270 });
        }
      }
    }

    return arr;
  }, [capacity, shape, radius, width, height]);

  const wrapperDim = shape === "round"
    ? tableRadius * 2 + chairSize * 2
    : Math.max(width, height) + chairOffset * 2 + chairSize * 2;

  return (
    <div
      className={styles.tableContainer}
      style={{
        width: wrapperDim,
        height: wrapperDim,
      }}
    >
      {chairPositions.map((pos, idx) => {
        const isOccupied = idx < usedSeats;
        const chairColor = isOccupied ? "#a5e5b5" : "#5a3e1b";

        return (
          <FaChair
            key={idx}
            className={styles.chairIcon}
            style={{
              width: chairSize,
              height: chairSize,
              position: "absolute",
              top: `calc(50% + ${pos.top}px - ${chairSize / 2}px)`,
              left: `calc(50% + ${pos.left}px - ${chairSize / 2}px)`,
              transform: `rotate(${pos.rotationDeg}deg)`,
              color: chairColor,
            }}
            title={`Chair ${idx + 1}`}
          />
        );
      })}

      <div
        className={styles.tableShape}
        style={{
          width: width,
          height: height,
          borderRadius,
          transform: `rotate(${rotation}deg)`,
          top: `calc(50% - ${height / 2}px)`,
          left: `calc(50% - ${width / 2}px)`,
        }}
        onClick={onClick}
      >
        <span className={styles.label}>{name}</span>

        <div className={styles.usage}>
          {usedSeats} / {capacity}
        </div>

        {onDelete && (
          <button className={styles.deleteButton} onClick={onDelete}>
            ✕
          </button>
        )}

        {onRotate && shape === "rectangle" && (
          <button className={styles.rotateButton} onClick={onRotate}>
            ↻
          </button>
        )}
      </div>
    </div>
  );
}