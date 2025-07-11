import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Image as KonvaImage,
  Text as KonvaText,
  Group,
} from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import styles from "./Invitation.module.css";
import { jsPDF } from "jspdf";
import invitationService from "../../services/invitation-service";
import * as Icons from "../../icons/index";
import {toast} from "react-toastify";

interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width?: number;
}

interface Sentence {
  _id?: string;
  title: string;
}

interface Props {
  userId: string;
  backgroundUrl: string;
  coupleNames: string;
  sentences: Sentence[];
  existingDesignJson?: TextItem[];
  date: string;
  receptionHour: string;
  ceremonyHour: string;
  venue: string;
}

const STAGE_W = 500;
const STAGE_H = 600;

const WHITE_BOX_X = 110;
const WHITE_BOX_WIDTH = 300;
const WHITE_BOX_Y = 20;
const WHITE_BOX_HEIGHT = 510;

const CATEGORY_COLOR = "#7e46c1";

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
  sentences,
  existingDesignJson,
  date,
  venue,
  ceremonyHour,
  receptionHour
}: Props) {
  const [image] = useImage(backgroundUrl, "anonymous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sentencesState, setSentencesState] = useState<TextItem[]>([]);
  const [rectangle, setRectangle] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const stageRef = useRef<Konva.Stage| null>(null);
  const rectRef = useRef<Konva.Rect | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  // Sync transformer to selected rectangle
  useEffect(() => {
    if (selectedId === "rectangle" && rectRef.current && trRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()?.batchDraw();
    } else if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  useEffect(() => {
    if (existingDesignJson && existingDesignJson.length > 0) {
      const fixedTexts = existingDesignJson.map((t) => ({
        ...t,
        x: WHITE_BOX_X,
        width: WHITE_BOX_WIDTH,
      }));
      setSentencesState(fixedTexts);
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
          width: WHITE_BOX_WIDTH,
        });
        runningY += 10;
      }
      if (date) {
        canvasTexts.push({
          id: "date",
          text: date,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 20,
          fontFamily: "Delius",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });
        runningY += 10;
      }

      if(ceremonyHour) {
        canvasTexts.push({
          id: "ceremonyHourTitle",
          text: "Ceremony",
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 25,
          fontFamily: "Arial",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });

        runningY += 10;

        canvasTexts.push({
          id: "ceremonyHour",
          text: ceremonyHour,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 20,
          fontFamily: "Delius",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });
        runningY += 10;
      }

      if(receptionHour) {
        canvasTexts.push({
          id: "receptionHour",
          text: receptionHour,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 25,
          fontFamily: "Arial",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });
        runningY += 10;

        canvasTexts.push({
          id: "receptionHourTitle",
          text: "Reception",
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 30,
          fontFamily: "Send Flowers",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });
        runningY += 10;
      }

      if(venue) {
        canvasTexts.push({
          id: "venue",
          text: venue,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 20,
          fontFamily: "Arial",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });
        runningY += 10;
      }



      sentences.forEach((cat, catIdx) => {
        canvasTexts.push({
          id: `name-${cat.title}-${catIdx}`,
          text: cat.title,
          x: WHITE_BOX_X,
          y: runningY,
          fontSize: 18,
          fontFamily: "Almuni",
          fill: CATEGORY_COLOR,
          width: WHITE_BOX_WIDTH,
        });

      });

      setSentencesState(canvasTexts);
    }
  }, [existingDesignJson, coupleNames, sentences, ceremonyHour, date, receptionHour, venue]);

  const handleAddRectangle = () => {
    if (!rectangle) {
      setRectangle({
        x: WHITE_BOX_X + 10,
        y: WHITE_BOX_Y + 10,
        width: 100,
        height: 200,
      });
      setSelectedId("rectangle");
    }
  };

  const handleUpdate = (id: string, newProps: Partial<TextItem>) => {
    setSentencesState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...newProps } : t))
    );
  };

  async function handleSave() {
    if (!stageRef.current) {
      toast.warn("Stage not ready");
      return;
    }
    setSaving(true);
    try {
      const pngDataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      const designJson = sentencesState;

      await invitationService.updateFinals(userId, {
        finalPng: pngDataUrl,
        finalCanvasJson: JSON.stringify(designJson),
      });

      toast.success("Invitation saved successfully");
    } catch (error) {
      console.error("Failed to save invitation:", error);
      toast.error("Failed to save invitation");
    } finally {
      setSaving(false);
    }
  }

  const handleDownloadImage = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "invitation.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function handleDownloadPDF() {
    if (!stageRef.current) return;
    const pngBase64 = stageRef.current.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [STAGE_W, STAGE_H],
    });
    pdf.addImage(pngBase64, "PNG", 0, 0, STAGE_W, STAGE_H);
    pdf.save("invitation.pdf");
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
      <div className={styles.editZone}>
        <h3>Edit Zone</h3>

        <span
          onClick={handleAddRectangle}
        >
          <Icons.ShapeIcon title="Add Rectangle" className="icon"/>
        </span>

        {!selectedId && <div>Select a text on the image to edit</div>}
        {selectedId && selectedId !== "rectangle" && (
          <>
            <div className="editRow">
              <label>Font size:</label>
              <input
                type="range"
                min={1}
                max={40}
                value={sentencesState.find((t) => t.id === selectedId)?.fontSize ?? 14}
                onChange={(e) => {
                  handleUpdate(selectedId, { fontSize: +e.target.value });
                }}
              />
              <span>{sentencesState.find((t) => t.id === selectedId)?.fontSize}px</span>
            </div>

            <div className="editRow">
              <label>Font family:</label>
              <select
                value={
                  sentencesState.find((t) => t.id === selectedId)?.fontFamily ??
                  AVAILABLE_FONTS[0]
                }
                onChange={(e) => {
                  handleUpdate(selectedId, { fontFamily: e.target.value });
                }}
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
                value={sentencesState.find((t) => t.id === selectedId)?.fill ?? CATEGORY_COLOR}
                onChange={(e) => {
                  handleUpdate(selectedId, { fill: e.target.value });
                }}
              />
            </div>
          </>
        )}

        <div
          className="iconRow"
          style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}
        >
          <span
            onClick={handleSave}
          >
            {saving ? <Icons.LoaderIcon className="spinner" /> : <Icons.CheckIcon className="icon" title="Save Invitation"/>}
          </span>

          <span
            onClick={handleDownloadImage}
            className="icon"
          >
            <Icons.PNGIcon title="Download PNG"/>
          </span>

          <span
            onClick={handleDownloadPDF}
          >
            <Icons.PDFIcon className="icon" title="Download PDF" />
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
        >
          <Layer>
            <KonvaImage
              image={image}
              width={STAGE_W}
              height={STAGE_H}
              crossOrigin="anonymous"
            />

            {rectangle && (
              <Rect
                ref={rectRef}
                x={rectangle.x}
                y={rectangle.y}
                width={rectangle.width}
                height={rectangle.height}
                
                fill="white"
                draggable
                onClick={() => setSelectedId("rectangle")}
                onTap={() => setSelectedId("rectangle")}

                onDragMove={(e) => {
                  const newX = Math.min(
                    Math.max(e.target.x(), WHITE_BOX_X),
                    WHITE_BOX_X + WHITE_BOX_WIDTH - rectangle.width
                  );
                  const newY = Math.min(
                    Math.max(e.target.y(), WHITE_BOX_Y),
                    WHITE_BOX_Y + WHITE_BOX_HEIGHT - rectangle.height
                  );
                  setRectangle({ ...rectangle, x: newX, y: newY });
                }}
                onTransformEnd={() => {
                  const node = rectRef.current;
                  if (node) {
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    const newWidth = Math.max(50, node.width() * scaleX);
                    const newHeight = Math.max(50, node.height() * scaleY);

                    setRectangle({ ...rectangle, width: newWidth, height: newHeight });
                  }
                }}
                dragBoundFunc={(pos) => {
                  const newX = Math.min(
                    Math.max(pos.x, WHITE_BOX_X),
                    WHITE_BOX_X + WHITE_BOX_WIDTH - rectangle.width
                  );
                  const newY = Math.min(
                    Math.max(pos.y, WHITE_BOX_Y),
                    WHITE_BOX_Y + WHITE_BOX_HEIGHT - rectangle.height
                  );
                  return { x: newX, y: newY };
                }}
              />
            )}

            {selectedId === "rectangle" && (
              <Transformer
                ref={trRef}
                rotateEnabled={false}
                anchorSize={10}
                borderStrokeWidth={0}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 50 || newBox.height < 50) return oldBox;
                  return newBox;
                }}
              />
            )}

            {sentencesState.map((t) => (
              <Group key={t.id}>
                <KonvaText
                  text={t.text}
                  x={t.x}
                  y={t.y}
                  width={t.width}
                  fontSize={t.fontSize}
                  fontFamily={t.fontFamily}
                  fill={t.fill}
                  draggable
                  dragBoundFunc={(pos) => {
                    return {
                      x: Math.min(
                        Math.max(pos.x, WHITE_BOX_X),
                        WHITE_BOX_X + WHITE_BOX_WIDTH 
                      ),
                      y: Math.min(
                        Math.max(pos.y, WHITE_BOX_Y),
                        WHITE_BOX_Y + WHITE_BOX_HEIGHT - t.fontSize
                      ),
                    };
                  }}
                  onDragMove={(e) => {
                    const newX = e.target.x();
                    const newY = e.target.y();
                    setSelectedId(t.id);
                    setSentencesState((prev) =>
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