import React, { useState, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Group } from "react-konva";
import useImage from "use-image";
import styles from "./Menu.module.css";
import { BsFiletypePdf, BsFiletypePng } from "react-icons/bs";
import { IoCheckmarkOutline } from "react-icons/io5";

// עזר להורדת תמונה
function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const FONTS = [
  "Rubik",
  "Cormorant Garamond",
  "Playfair Display",
  "Arial",
  "Georgia",
  "serif",
];

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: string;
  isVegetarian?: boolean;
}

interface Props {
  backgroundUrl: string;
  dishes: Dish[];
}

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
const STAGE_W = 450;
const STAGE_H = 550;

function getDefaultTextItems(dishes: Dish[]) {
  const catsWithDishes = [...new Set(dishes.map((d) => d.category))];
  return catsWithDishes.map((cat, idx) => ({
    id: `cat-${cat}`,
    text: cat,
    x: 185,
    y: 70 + idx * 70,
    fontSize: 18,
    fontFamily: "Rubik",
    fill: CATEGORY_COLOR,
    align: "center",
    isCategory: true,
  }));
}

export default function DesignSection({ backgroundUrl, dishes }: Props) {
  const [image] = useImage(backgroundUrl);
  const [canvasTexts, setCanvasTexts] = useState<TextItem[]>(getDefaultTextItems(dishes));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const categories = [...new Set(dishes.map((d) => d.category))];
  const dishesByCategory = categories.map((cat) => ({
    category: cat,
    dishes: dishes.filter((d) => d.category === cat),
  }));

  function addDishToMenu(dish: Dish) {
    if (canvasTexts.find((t) => t.groupId === dish.id && t.isName)) return;
    const catIdx = canvasTexts.findIndex(
      (t) => t.isCategory && t.text === dish.category
    );
    const baseY = canvasTexts[catIdx]?.y ?? 110;
    const groupCount = canvasTexts.filter(
      (t, idx) =>
        idx > catIdx &&
        t.groupId &&
        dishes.find((d) => d.id === t.groupId)?.category === dish.category &&
        t.isName
    ).length;
    const dy = 40 + groupCount * 45;

    setCanvasTexts((prev) => [
      ...prev,
      {
        id: `name-${dish.id}`,
        text: `${dish.name}${dish.isVegetarian ? " 🍃" : ""}`,
        x: 190,
        y: baseY + dy,
        fontSize: 15,
        fontFamily: "Rubik",
        fill: DISH_COLOR,
        align: "center",
        isName: true,
        groupId: dish.id,
        isVegetarian: dish.isVegetarian,
      },
      {
        id: `desc-${dish.id}`,
        text: dish.description,
        x: 190,
        y: baseY + dy + 18,
        fontSize: 12,
        fontFamily: "Rubik",
        fill: DESC_COLOR,
        align: "center",
        isName: false,
        groupId: dish.id,
      },
    ]);
  }

  function handleDrag(id: string, x: number, y: number) {
    const item = canvasTexts.find((t) => t.id === id);
    if (!item?.groupId) {
      setCanvasTexts((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
      return;
    }
    const group = canvasTexts.filter((t) => t.groupId === item.groupId);
    const [nameItem, descItem] = group[0].isName ? [group[0], group[1]] : [group[1], group[0]];
    const dyName = y - nameItem.y;
    const dxName = x - nameItem.x;
    setCanvasTexts((prev) =>
      prev.map((t) =>
        t.groupId === item.groupId
          ? { ...t, x: t.x + dxName, y: t.y + dyName }
          : t
      )
    );
  }

  function updateText(id: string, newProps: Partial<TextItem>) {
    setCanvasTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...newProps } : t)));
  }
  function updateGroup(id: string, newProps: Partial<TextItem>) {
    const groupId = canvasTexts.find((t) => t.id === id)?.groupId;
    setCanvasTexts((prev) =>
      prev.map((t) =>
        t.groupId === groupId
          ? { ...t, ...newProps }
          : t
      )
    );
  }

  // --- הורדה כתמונה ---
  function handleDownloadImage() {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadURI(uri, "menu.png");
  }

  // --- הורדה כ-PDF ---
  function handleDownloadPDF() {
    import("jspdf").then(jsPDF => {
      const pdf = new jsPDF.jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [STAGE_W, STAGE_H],
      });
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      pdf.addImage(uri, "PNG", 0, 0, STAGE_W, STAGE_H);
      pdf.save("menu.pdf");
    });
  }

  // --- שמירה לDB (כדוג') ---
  function handleDone() {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    // כאן תשלחי לשרת...
    alert("Menu saved to DB (הדגמה בלבד)");
  }

  const selected = canvasTexts.find((t) => t.id === selectedId);
  const selectedGroup = selected?.groupId
    ? canvasTexts.filter((t) => t.groupId === selected.groupId)
    : null;

  return (
    <div className={styles.menuMain}>
      {/* Edit Zone */}
      <div className={styles.editZone}>
        <div className={styles.editTitle}>Edit Zone</div>
        {!selected && <div className={styles.editPlaceholder}>Select a text on the image to edit</div>}
        {(selected || selectedGroup) && (
          <div className={styles.editControls}>
            <div className={styles.editRow}>
              <label>Font:</label>
              <select
                value={selected?.fontFamily}
                onChange={(e) =>
                  selected?.groupId
                    ? updateGroup(selected.id, { fontFamily: e.target.value })
                    : updateText(selected.id, { fontFamily: e.target.value })
                }
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div className={styles.editRow}>
              <label>Font size:</label>
              <input
                type="range"
                min={10}
                max={30}
                value={selected?.fontSize}
                onChange={(e) =>
                  selected?.groupId
                    ? updateGroup(selected.id, { fontSize: +e.target.value })
                    : updateText(selected.id, { fontSize: +e.target.value })
                }
              />
              <span>{selected?.fontSize}px</span>
            </div>
            <div className={styles.editRow}>
              <label>Color:</label>
              <input
                type="color"
                value={selected?.fill}
                onChange={(e) =>
                  selected?.groupId
                    ? updateGroup(selected.id, { fill: e.target.value })
                    : updateText(selected.id, { fill: e.target.value })
                }
              />
            </div>
            <div className={styles.editRow}>
              <label>Align:</label>
              <select
                value={selected?.align}
                onChange={(e) =>
                  selected?.groupId
                    ? updateGroup(selected.id, { align: e.target.value as any })
                    : updateText(selected.id, { align: e.target.value as any })
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )}
        {/* הורדה ושמירה */}
        <div className={styles.downloadRow}>
          <span className={styles.icon} onClick={handleDownloadImage}><BsFiletypePng /></span>
          <span className={styles.icon} onClick={handleDownloadPDF}><BsFiletypePdf /></span>
          <span className={styles.icon} onClick={handleDone}><IoCheckmarkOutline /></span>
        </div>
      </div>

      {/* Dishes List */}
      <div className={styles.dishListZone}>
        <div className={styles.dishesTitle}>Dishes</div>
        {dishesByCategory.map(({ category, dishes }) => (
          <div key={category} className={styles.dishCategory}>
            <div className={styles.catLabel}>{category}</div>
            {dishes.map((dish) => (
              <div className={styles.dishRow} key={dish.id}>
                <span className={styles.dishName}>{dish.name}</span>
                {dish.isVegetarian && <span title="Vegetarian" className={styles.vegLeaf}>🍃</span>}
                <span
                  className={styles.icon}
                  onClick={() => addDishToMenu(dish)}
                  title="Add to menu"
                >+</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Menu Image Zone */}
      <div className={styles.imageZone}>
        <Stage
          ref={stageRef}
          width={STAGE_W}
          height={STAGE_H}
          style={{ borderRadius: 14, background: "#fff" }}
          onMouseDown={e => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedId(null);
          }}
          onTouchStart={e => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedId(null);
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
                  onDragEnd={e => handleDrag(t.id, e.target.x(), e.target.y())}
                  onClick={ev => {
                    ev.cancelBubble = true;
                    setSelectedId(t.id);
                  }}
                  onTap={ev => {
                    ev.cancelBubble = true;
                    setSelectedId(t.id);
                  }}
                  lineHeight={t.isName ? 1.1 : 1.1}
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