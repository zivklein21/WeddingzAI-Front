import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Group,
} from "react-konva";
import useImage from "use-image";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import styles from "./Menu.module.css";
import { jsPDF } from "jspdf";
import { BsFiletypePdf, BsFiletypePng } from "react-icons/bs";
import menuService from "../../services/menu-service";

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
}

interface Dish {
  _id?: string;
  name: string;
  description: string;
  category: string;
  isVegetarian?: boolean;
}

interface Props {
  userId: string;
  backgroundUrl: string;
  coupleNames: string;
  dishes: Dish[];
  existingDesignJson?: TextItem[]; // JSON לעריכה חוזרת
  // onSave: (pngDataUrl: string, designJson: TextItem[]) => Promise<void>;
}

const STAGE_W = 500;
const STAGE_H = 600;

const WHITE_BOX_X = 110;
const WHITE_BOX_WIDTH = 280;
const WHITE_BOX_Y = 20;
const WHITE_BOX_HEIGHT = 510;

const CATEGORY_COLOR = "#7e46c1";
const DISH_COLOR = "#301b41";
const DESC_COLOR = "#9e7fc3";

const AVAILABLE_FONTS = [
  "Arial",
  "Almuni",
  "Caveat",
  "Karla",
  "Delius",
  "Send Flowers",
];

export default function DesignSection({
  userId,
  backgroundUrl,
  coupleNames,
  dishes,
  existingDesignJson,
  // onSave,
}: Props) {
  const [image] = useImage(backgroundUrl, "anonymous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textsState, setTextsState] = useState<TextItem[]>([]);
  const [saving, setSaving] = useState(false);

  const stageRef = useRef<any>(null);

  // טעינת נתונים לעריכה חוזרת או יצירת טקסטים חדשים
  useEffect(() => {
    if (existingDesignJson && existingDesignJson.length > 0) {
      // מוודא ש־x הוא תחילת הקופסה ושכל הטקסטים מיושרים ומוגדרים עם רוחב נכון
      const fixedTexts = existingDesignJson.map((t) => ({
        ...t,
        x: WHITE_BOX_X,
        width: WHITE_BOX_WIDTH,
        align: "center" as const,
      }));
      setTextsState(fixedTexts);
    } else {
      const canvasTexts: TextItem[] = [];
      let runningY = WHITE_BOX_Y + 30;

      if (coupleNames && coupleNames.trim().length > 0) {
        canvasTexts.push({
          id: "coupleNames",
          text: coupleNames,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 30,
          fontFamily: "Send Flowers",
          fill: CATEGORY_COLOR,
          align: "center",
          width: WHITE_BOX_WIDTH,
        });
        runningY += 60;
      }

      const categories = Array.from(new Set(dishes.map((d) => d.category)));

      categories.forEach((cat, catIdx) => {
        canvasTexts.push({
          id: `cat-${cat}-${catIdx}`,
          text: cat,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 18,
          fontFamily: "Almuni",
          fill: CATEGORY_COLOR,
          align: "center",
          width: WHITE_BOX_WIDTH,
        });

        runningY += 40;

        const dishesInCat = dishes.filter((d) => d.category === cat);
        dishesInCat.forEach((dish, dishIdx) => {
          canvasTexts.push({
            id: `name-${dish._id}-${dishIdx}`,
            text: dish.name + (dish.isVegetarian ? " 🍃" : ""),
            x: WHITE_BOX_X,
            y: runningY,
            fontSize: 14,
            fontFamily: "Almuni",
            fill: DISH_COLOR,
            align: "center",
            width: WHITE_BOX_WIDTH,
          });
          runningY += 20;

          canvasTexts.push({
            id: `desc-${dish._id}-${dishIdx}`,
            text: dish.description,
            x: WHITE_BOX_X,
            y: runningY,
            fontSize: 12,
            fontFamily: "Almuni",
            fill: DESC_COLOR,
            align: "center",
            width: WHITE_BOX_WIDTH,
          });
          runningY += 35;
        });
      });

      setTextsState(canvasTexts);
    }
  }, [existingDesignJson, coupleNames, dishes]);

  function handleUpdate(id: string, newProps: Partial<TextItem>) {
    setTextsState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...newProps } : t))
    );
  }

  async function handleSave() {
    if (!stageRef.current) {
      alert("Stage not ready");
      return;
    }
    setSaving(true);
    try {
      // שמירת תמונת PNG מהקנבס
      const pngDataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      // שמירת JSON של הטקסטים (העיצוב)
      const designJson = textsState;

      // קריאה לפונקציה חיצונית לשמירת התמונה והעיצוב
            await menuService.updateFinals(userId, {
        finalPng: pngDataUrl,
        finalCanvasJson: JSON.stringify(designJson),
      });


      alert("Menu saved successfully");
    } catch (error) {
      console.error("Failed to save menu:", error);
      alert("Failed to save menu");
    } finally {
      setSaving(false);
    }
  }

  function handleDownloadImage() {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "menu.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleDownloadPDF() {
    if (!stageRef.current) return;
    const pngBase64 = stageRef.current.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [STAGE_W, STAGE_H],
    });
    pdf.addImage(pngBase64, "PNG", 0, 0, STAGE_W, STAGE_H);
    pdf.save("menu.pdf");
  }

  const selected = textsState.find((t) => t.id === selectedId);

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
      <div className="editZone">
        <h3>Edit Zone</h3>
        {!selected && <div>Select a text on the image to edit</div>}
        {selected && (
          <>
            <div className="editRow">
              <label>Font size:</label>
              <input
                type="range"
                min={1}
                max={40}
                value={selected.fontSize}
                onChange={(e) =>
                  handleUpdate(selected.id, { fontSize: +e.target.value })
                }
              />
              <span>{selected.fontSize}px</span>
            </div>

            <div className="editRow">
              <label>Font family:</label>
              <select
                value={selected.fontFamily}
                onChange={(e) =>
                  handleUpdate(selected.id, { fontFamily: e.target.value })
                }
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="editRow">
              <label>Color:</label>
              <input
                type="color"
                value={selected.fill}
                onChange={(e) => handleUpdate(selected.id, { fill: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="iconRow" style={{ marginTop: 20 }}>
          <span onClick={handleSave} className={styles.icon} style={{ fontSize: 30, marginLeft: 12 }}>
            {saving ? <FiLoader className={styles.spinner} /> : <IoCheckmarkOutline />}
          </span>

          <span onClick={handleDownloadImage} className={styles.icon} title="Download PNG" style={{ fontSize: 30, marginLeft: 12}}>
            <BsFiletypePng />
          </span>

          <span onClick={handleDownloadPDF} className={styles.icon} title="Download PDF" style={{ fontSize: 30, marginLeft: 12 }}>
            <BsFiletypePdf />
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
            <KonvaImage image={image} width={STAGE_W} height={STAGE_H} crossOrigin="anonymous" />
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
                  dragBoundFunc={(pos) => {
                    // אפשר להגביל רק אם הטקסט הוא מהעיצוב החדש
                    return {
                      x: Math.min(Math.max(pos.x, WHITE_BOX_X), WHITE_BOX_X + WHITE_BOX_WIDTH - (t.width || 0)),
                      y: Math.min(Math.max(pos.y, WHITE_BOX_Y), WHITE_BOX_Y + WHITE_BOX_HEIGHT - t.fontSize),
                    };
                  }}
                  onDragMove={(e) => {
                    const newX = e.target.x();
                    const newY = e.target.y();
                    setSelectedId(t.id);
                    setTextsState((prev) =>
                      prev.map((text) =>
                        text.id === t.id ? { ...text, x: newX, y: newY } : text
                      )
                    );
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