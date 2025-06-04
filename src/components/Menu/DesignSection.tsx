// src/components/Menu/DesignSection.tsx
import React, { useState, useRef,  } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Group,
} from "react-konva";
import useImage from "use-image";
import styles from "./Menu.module.css";
import { BsFiletypePdf, BsFiletypePng } from "react-icons/bs";
import { IoCheckmarkOutline } from "react-icons/io5";
import  { Dish as DishType } from "../../services/menu-service";

interface Props {
  backgroundUrl: string;
  dishes: DishType[];
}

// ---- LOGIC FUNCTIONS AND CONSTANTS ----
function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const FONTS = ["Rubik", "Arial", "Georgia", "serif"];
export const STAGE_W = 450;
export const STAGE_H = 550;

type TextItem = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: "center" | "left" | "right";
  isCategory?: boolean;
  isName?: boolean;
  groupId?: string;
  isVegetarian?: boolean;
};

const CATEGORY_COLOR = "#7e46c1";
const DISH_COLOR = "#301b41";
const DESC_COLOR = "#9e7fc3";

// Generate default text items for categories
function getDefaultTextItems(dishes: DishType[]): TextItem[] {
  const uniqueCategories = Array.from(new Set(dishes.map((d) => d.category)));
  return uniqueCategories.map((cat, idx) => ({
    id: `cat-${cat}`,
    text: cat,
    x: STAGE_W / 2,
    y: 70 + idx * 70,
    fontSize: 18,
    fontFamily: "Rubik",
    fill: CATEGORY_COLOR,
    align: "center",
    isCategory: true,
  }));
}

// Add dish to menu canvasTexts
function addDishToMenu(canvasTexts: TextItem[], dish: DishType): TextItem[] {
  const dishId = dish._id!;
  if (canvasTexts.some((t) => t.groupId === dishId && t.isName)) return canvasTexts;

  const catIdx = canvasTexts.findIndex((t) => t.isCategory && t.text === dish.category);
  const baseY = catIdx >= 0 ? canvasTexts[catIdx].y : 100;

  const groupCount = canvasTexts.filter((t, idx) => {
    if (idx <= catIdx) return false;
    return t.groupId === dishId && t.isName;
  }).length;

  const dy = 40 + groupCount * 45;

  const nameItem: TextItem = {
    id: `name-${dishId}`,
    text: dish.name + (dish.isVegetarian ? " 🍃" : ""),
    x: STAGE_W / 2,
    y: baseY + dy,
    fontSize: 15,
    fontFamily: "Rubik",
    fill: DISH_COLOR,
    align: "center",
    isName: true,
    groupId: dishId,
    isVegetarian: dish.isVegetarian,
  };
  const descItem: TextItem = {
    id: `desc-${dishId}`,
    text: dish.description,
    x: STAGE_W / 2,
    y: baseY + dy + 18,
    fontSize: 12,
    fontFamily: "Rubik",
    fill: DESC_COLOR,
    align: "center",
    isName: false,
    groupId: dishId,
  };
  return [...canvasTexts, nameItem, descItem];
}

// Handle drag for a single or group
function handleDrag(canvasTexts: TextItem[], id: string, newX: number, newY: number): TextItem[] {
  const dragged = canvasTexts.find((t) => t.id === id);
  if (!dragged) return canvasTexts;
  const dx = newX - dragged.x;
  const dy = newY - dragged.y;
  if (!dragged.groupId) {
    return canvasTexts.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t));
  } else {
    return canvasTexts.map((t) =>
      t.groupId === dragged.groupId ? { ...t, x: t.x + dx, y: t.y + dy } : t
    );
  }
}

// Update a single text item
function updateText(canvasTexts: TextItem[], id: string, newProps: Partial<TextItem>): TextItem[] {
  return canvasTexts.map((t) => (t.id === id ? { ...t, ...newProps } : t));
}

// Update a group of items
function updateGroup(canvasTexts: TextItem[], id: string, newProps: Partial<TextItem>): TextItem[] {
  const groupId = canvasTexts.find((t) => t.id === id)?.groupId;
  if (!groupId) return canvasTexts;
  return canvasTexts.map((t) => (t.groupId === groupId ? { ...t, ...newProps } : t));
}

// ---- COMPONENT ----

export default function DesignSection({ backgroundUrl, dishes}: Props) {
  const [image] = useImage(backgroundUrl);
  const [canvasTexts, setCanvasTexts] = useState<TextItem[]>(() => getDefaultTextItems(dishes));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);


  // Prepare dishes by category
  const categories = Array.from(new Set(dishes.map((d) => d.category)));
  const dishesByCategory = categories.map((cat) => ({
    category: cat,
    dishes: dishes.filter((d) => d.category === cat),
  }));

  // Download PNG
  function handleDownloadImage() {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadURI(uri, "menu.png");
  }

  // Download PDF
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

  // Save to DB
  async function handleDone() {
    if (!stageRef.current) {
      alert("Menu not ready");
      return;
    }
    const pngBase64 = stageRef.current.toDataURL({ pixelRatio: 2 });
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [STAGE_W, STAGE_H],
    });
    pdf.addImage(pngBase64, "PNG", 0, 0, STAGE_W, STAGE_H);
    pdf.save("menu.pdf");
    // אתה יכול להוריד גם את ה-PNG
    downloadURI(pngBase64, "menu.png");
    alert("Menu exported!"); // תן פידבק למשתמש
  }

  // UI logic
  const selected = canvasTexts.find((t) => t.id === selectedId);
  const selectedGroup = selected?.groupId
    ? canvasTexts.filter((t) => t.groupId === selected.groupId)
    : null;

  // ---- RENDER ----
  return (
    <div className={styles.menuMain}>
      {/* Edit Zone */}
      <div className={styles.editZone}>
        <div className={styles.editTitle}>Edit Zone</div>
        {!selected && (
          <div className={styles.editPlaceholder}>Select a text on the image to edit</div>
        )}
        {(selected || selectedGroup) && (
          <div className={styles.editControls}>
            <div className={styles.editRow}>
              <label>Font:</label>
              <select
                value={selected?.fontFamily || ""}
                onChange={e => {
                  if (!selected) return;
                  if (selected.groupId) {
                    setCanvasTexts(ct => updateGroup(ct, selected.id, { fontFamily: e.target.value }));
                  } else {
                    setCanvasTexts(ct => updateText(ct, selected.id, { fontFamily: e.target.value }));
                  }
                }}
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.editRow}>
              <label>Font size:</label>
              <input
                type="range"
                min={10}
                max={30}
                value={selected?.fontSize || 12}
                onChange={e => {
                  if (!selected) return;
                  if (selected.groupId) {
                    setCanvasTexts(ct => updateGroup(ct, selected.id, { fontFamily: e.target.value }));
                  } else {
                    setCanvasTexts(ct => updateText(ct, selected.id, { fontFamily: e.target.value }));
                  }
                }}
              />
              <span>{selected?.fontSize}px</span>
            </div>
            <div className={styles.editRow}>
              <label>Color:</label>
              <input
                type="color"
                value={selected?.fill || "#000000"}
                onChange={e => {
                  if (!selected) return;
                  if (selected.groupId) {
                    setCanvasTexts(ct => updateGroup(ct, selected.id, { fontFamily: e.target.value }));
                  } else {
                    setCanvasTexts(ct => updateText(ct, selected.id, { fontFamily: e.target.value }));
                  }
                }}
              />
            </div>
            <div className={styles.editRow}>
              <label>Align:</label>
              <select
                value={selected?.align || "center"}
                onChange={e => {
                  if (!selected) return;
                  const alignValue = e.target.value as "left" | "center" | "right";
                  if (selected.groupId) {
                    setCanvasTexts(ct => updateGroup(ct, selected.id, { align: alignValue }));
                  } else {
                    setCanvasTexts(ct => updateText(ct, selected.id, { align: alignValue }));
                  }
                }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )}
        <div className={styles.downloadRow}>
          <span className={styles.icon} onClick={handleDownloadImage} title="Download PNG">
            <BsFiletypePng />
          </span>
          <span className={styles.icon} onClick={handleDownloadPDF} title="Download PDF">
            <BsFiletypePdf />
          </span>
          <span className={styles.icon} onClick={handleDone} title="Save to DB">
            <IoCheckmarkOutline />
          </span>
        </div>
      </div>
      {/* Dishes List */}
      <div className={styles.dishListZone}>
        <div className={styles.dishesTitle}>Dishes</div>
        {dishesByCategory.map(({ category, dishes }) => (
          <div key={category} className={styles.dishCategory}>
            <div className={styles.catLabel}>{category}</div>
            {dishes.map((dish) => {
              const dishId = dish._id!;
              const already = !!canvasTexts.find((t) => t.groupId === dishId && t.isName);
              return (
                <div className={styles.dishRow} key={dishId}>
                  <span className={styles.dishName}>{dish.name}</span>
                  {dish.isVegetarian && (
                    <span title="Vegetarian" className={styles.vegLeaf}>
                      🍃
                    </span>
                  )}
                  <span
                    className={styles.icon}
                    onClick={() => setCanvasTexts((ct) => addDishToMenu(ct, dish))}
                    style={{
                      opacity: already ? 0.3 : 1,
                      pointerEvents: already ? "none" : "auto",
                    }}
                    title={already ? "Already added" : "Add to menu"}
                  >
                    +
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Konva Canvas */}
      <div className={styles.imageZone}>
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
            {canvasTexts.map((t) => (
              <Group key={t.id}>
                <KonvaText
                  text={t.text}
                  x={t.x}
                  y={t.y}
                  fontSize={t.fontSize}
                  fontFamily={t.fontFamily}
                  fill={t.fill}
                  align={t.align}
                  width={320}
                  draggable
                  onDragStart={() => setSelectedId(t.id)}
                  onDragEnd={(e) =>
                    setCanvasTexts((ct) =>
                      handleDrag(ct, t.id, e.target.x(), e.target.y())
                    )
                  }
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    setSelectedId(t.id);
                  }}
                  lineHeight={1.1}
                  stroke={selectedId === t.id ? "#b291ff" : ""}
                  strokeWidth={selectedId === t.id ? 1 : 0}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}