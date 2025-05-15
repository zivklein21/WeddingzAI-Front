import { useDraggable } from "@dnd-kit/core";
import styles from "../../pages/SeatingPage/SeatingPage.module.css";

type DraggableTableProps = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export default function DraggableTable({
  id,
  name,
  x,
  y,
}: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const finalX = transform ? x + transform.x : x;
  const finalY = transform ? y + transform.y : y;

  const style = {
    transform: `translate(${finalX}px, ${finalY}px)`,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className={styles.table}>{name}</div>
    </div>
  );
}
