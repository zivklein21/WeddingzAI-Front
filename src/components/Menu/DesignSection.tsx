import React, { useState, useRef } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Group,
} from "react-konva";
import useImage from "use-image";

import { BsFiletypePdf, BsFiletypePng } from "react-icons/bs";
import styles from "./Menu.module.css";
import { IoCheckmarkOutline } from "react-icons/io5";

interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: "center" | "left" | "right";
  width?: number;
  isCategory?: boolean;
  isName?: boolean;
  groupId?: string;
  isVegetarian?: boolean;
}

interface Props {
  backgroundUrl: string;
  dishes: {
    _id: string;
    name: string;
    description: string;
    category: string;
    isVegetarian?: boolean;
  }[];
}

const STAGE_W = 500;
const STAGE_H = 600;

const WHITE_BOX_X = 110;   // מיקום המלבן הלבן בתוך הקנבס (שוליים שמאליים)
const WHITE_BOX_WIDTH = 280; // רוחב המלבן הלבן

const CATEGORY_COLOR = "#7e46c1";
const DISH_COLOR = "#301b41";
const DESC_COLOR = "#9e7fc3";

function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DesignSection({ backgroundUrl, dishes }: Props) {
  const [image] = useImage(backgroundUrl);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // בונים את רשימת הטקסטים לפי קטגוריות ומנות
  const canvasTexts: TextItem[] = [];
  const categories = Array.from(new Set(dishes.map((d) => d.category)));
  let runningY = 40;  // מתחילים מלמעלה

  categories.forEach((cat, catIdx) => {
    // Category
    canvasTexts.push({
      id: `cat-${cat}-${catIdx}`,
      text: cat,
      x: WHITE_BOX_X,
      y: runningY,
      fontSize: 16,
      fontFamily: "Rubik",
      fill: CATEGORY_COLOR,
      align: "center",
      width: WHITE_BOX_WIDTH,
      isCategory: true,
    });

    runningY += 40; 

    const dishesInCat = dishes.filter((d) => d.category === cat);
    dishesInCat.forEach((dish, dishIdx) => {
      // Dish Name
      canvasTexts.push({
        id: `name-${dish._id}-${dishIdx}`,
        text: dish.name + (dish.isVegetarian ? " 🍃" : ""),
        x: WHITE_BOX_X,
        y: runningY,
        fontSize: 14,
        fontFamily: "Rubik",
        fill: DISH_COLOR,
        align: "center",
        width: WHITE_BOX_WIDTH,
        groupId: dish._id,
        isName: true,
      });

      runningY += 20;

      // Dish Desc
      canvasTexts.push({
        id: `desc-${dish._id}-${dishIdx}`,
        text: dish.description,
        x: WHITE_BOX_X,
        y: runningY,
        fontSize: 12,
        fontFamily: "Rubik",
        fill: DESC_COLOR,
        align: "center",
        width: WHITE_BOX_WIDTH,
        groupId: dish._id,
        isName: false,
      });

      runningY += 40;
    });
  });

  const [textsState, setTextsState] = useState<TextItem[]>(canvasTexts);
  const stageRef = useRef<any>(null);

  function handleDrag(id: string, x: number, y: number) {
    setTextsState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, x, y } : t))
    );
  }

  function handleUpdate(id: string, newProps: Partial<TextItem>) {
    setTextsState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...newProps } : t))
    );
  }

  const selected = textsState.find((t) => t.id === selectedId);

  function handleDownloadImage() {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadURI(uri, "menu.png");
  }

  async function handleDownloadPDF() {
    if (!stageRef.current) return;
    const pngBase64 = stageRef.current.toDataURL({ pixelRatio: 2 });
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [STAGE_W, STAGE_H],
    });
    pdf.addImage(pngBase64, "PNG", 0, 0, STAGE_W, STAGE_H);
    pdf.save("menu.pdf");
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: 20,
        height: "100%",
        padding: 20,
      }}
    >
      {/* Edit Zone */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 20,
          backgroundColor: "#fafafa",
        }}
      >
        <h3>Edit Zone</h3>
        {!selected && <div>Select a text on the image to edit</div>}
        {selected && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label>Font size: </label>
              <input
                type="range"
                min={1}
                max={40}
                value={selected.fontSize}
                onChange={(e) =>
                  handleUpdate(selected.id, { fontSize: +e.target.value })
                }
              />
              <span style={{ marginLeft: 10 }}>{selected.fontSize}px</span>
            </div>
            <div>
              <label>Color: </label>
              <input
                type="color"
                value={selected.fill}
                onChange={(e) =>
                  handleUpdate(selected.id, { fill: e.target.value })
                }
              />
            </div>
          </>
        )}
        <div style={{ marginTop: 20 }}>
          <span onClick={handleDownloadImage} className={styles.icon} style={{ fontSize: 30 }}>
            <BsFiletypePng />
          </span>
          <span className={styles.icon} style={{ fontSize: 30 }} onClick={handleDownloadPDF}>
            <BsFiletypePdf />
          </span>
          <span
            title="Save menu"
            style={{ fontSize: 30 }}
          >
            <IoCheckmarkOutline/>
          </span>
        </div>
      </div>

      {/* Canvas Zone */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Stage
          ref={stageRef}
          width={STAGE_W}
          height={STAGE_H}
          style={{ borderRadius: 14, background: "#fff" }}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          <Layer>
            <KonvaImage image={image} width={STAGE_W} height={STAGE_H} />
            {textsState.map((t) => (
              <Group key={t.id}>
                <KonvaText
                  text={t.text}
                  x={t.x}
                  y={t.y}
                  width={t.width}
                  fontSize={t.fontSize}
                  fontFamily={t.fontFamily}
                  fill={t.fill}
                  align={t.align}
                  draggable
                  onDragEnd={(e) => {
                    setSelectedId(t.id);
                    handleDrag(t.id, e.target.x(), e.target.y());
                  }}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedId(t.id);
                  }}
                  lineHeight={1.1}
                  shadowColor={selectedId === t.id ? "#b291ff" : undefined}
                  shadowBlur={selectedId === t.id ? 10 : 0}
                  shadowOpacity={selectedId === t.id ? 0.3 : 0}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}