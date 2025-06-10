import React, { useState, useEffect } from "react";
import invitationService, { Sentence as SentenceType } from "../../services/invitation-service";
import styles from "./Invitation.module.css";

import * as Icons from "../../icons/index";
import { data } from "react-router-dom";

interface Props {
  userId: string;
  sentences: SentenceType[];
  setSentences: (t: SentenceType[]) => void;
  onDone: () => void;
  venue: string;
  date: string;
}

const emptySentence: SentenceType = {
  title: "",
};

export default function DetailsSection({ userId, sentences, setSentences, onDone, venue, date }: Props) {
  const [form, setForm] = useState<SentenceType>(emptySentence);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedSentence, setEditedSentence] = useState<SentenceType | null>(null);
  const [receptionHour, setReceptionHour] = useState(""); 
  const [ceremonyHour, setCeremonyHour] = useState("");  
  const [editingHour, setEditingHour] = useState<null | "reception" | "ceremony">(null);
  const [editHourValue, setEditHourValue] = useState(""); 

  useEffect(() => {
    if (userId && sentences.length === 0) {
      const fetchTexst = async () => {
        setLoading(true);
        try {
          const res = await invitationService.getInvitationByUserId(userId);
          if (res.data && res.data.sentences) {
            setSentences(res.data.sentences);
          } else {
            setSentences([]);
          }
          if (res.data && res.data.receptionHour) setReceptionHour(res.data.receptionHour);
          if (res.data && res.data.ceremonyHour) setCeremonyHour(res.data.ceremonyHour);

        } catch (err) {
          console.error("Failed to fetch sentences", err);
          alert("Failed to fetch sentences");
        } finally {
          setLoading(false);
        }
      };
      fetchTexst();
    }
  }, [userId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSentences([...sentences, { ...form }]);
    setForm(emptySentence);
  };

  const handleRemove = (idx: number) => {
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditedSentence(null);
    }
    setSentences(sentences.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditedSentence({ ...sentences[idx] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedSentence(null);
  };

  const saveEdit = () => {
    if (editedSentence) {
      const newTexts = [...sentences];
      newTexts[editingIndex!] = editedSentence;
      setSentences(newTexts);
      setEditingIndex(null);
      setEditedSentence(null);
    }
  };

  const handleSaveAll = async () => {
    if (!userId) {
      alert("Missing user ID");
      return;
    }
    if (!receptionHour || !ceremonyHour) {
    alert("Please enter both reception and ceremony hours");
    return;
  }
  if (!venue || venue == "TBD" || !date || date == "TBD") {
    alert("Can't create Invitation without Date Or Venue!")
    return;
  }
    setLoading(true);
    try {
      await invitationService.updateTextsByUserId(userId, sentences);
      console.log(ceremonyHour, receptionHour);
      await invitationService.updateHoursByUserId(userId,ceremonyHour, receptionHour)
      alert("Details saved successfully");
      onDone();
    } catch (err) {
      console.error("Failed to save Details", err);
      alert("Failed to save Detaisl");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className={styles.formRow}
      >
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Title"
          required
          className={styles.input}
        />
        <span className="icon" onClick={handleAdd}>
          <Icons.AddIcon />
        </span>
      </form>

      {sentences.length === 0 ? (
        <div className={styles.yesMessage}>No sentences added yet</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.menuTable}>
            <thead>
              <tr>
                <th>Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sentences.map((sentence, i) => (
                <tr key={i}>
                  <td>
                    {editingIndex === i ? (
                      <input
                        className={styles.editInput}
                        value={editedSentence?.title || ""}
                        onChange={(e) =>
                          setEditedSentence((d) => d && { ...d, title: e.target.value })
                        }
                      />
                    ) : (
                      sentence.title
                    )}
                  </td>
                  <td>
                    {editingIndex === i ? (
                      <>
                        <span onClick={saveEdit} className="icon"  style={{ marginRight: 6 }}>
                          <Icons.SaveIcon title="Save Text"/>
                        </span>
                        <span onClick={cancelEdit} className="icon" >
                          <Icons.CloseIcon title="Cancel Edit"/>
                        </span>
                      </>
                    ) : (
                      <>
                        <span onClick={() => startEdit(i)} className="icon" style={{ marginRight: 6 }}>
                          <Icons.EditIocn title="Edit Text"/>
                        </span>
                        <span onClick={() => handleRemove(i)} className="icon" >
                          <Icons.DeleteIcon title="Delete Text"/>
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hours */}
      <div className={styles.tableWrapper} style={{ marginTop: 32 }}>
        <table className={styles.menuTable}>
          <thead>
            <tr>
              <th>Reception Time</th>
              <th>Ceremony Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* שעת קבלת פנים */}
              <td>
                {editingHour === "reception" ? (
                  <input
                    type="time"
                    className={styles.input}
                    value={editHourValue}
                    onChange={e => setEditHourValue(e.target.value)}
                    required
                  />
                ) : (
                  receptionHour || <span style={{color:'#999'}}>Not Set</span>
                )}
              </td>
              {/* שעת חופה */}
              <td>
                {editingHour === "ceremony" ? (
                  <input
                    type="time"
                    className={styles.input}
                    value={editHourValue}
                    onChange={e => setEditHourValue(e.target.value)}
                    required
                  />
                ) : (
                  ceremonyHour || <span style={{color:'#999'}}>Not Set</span>
                )}
              </td>
              {/* פעולות */}
              <td>
                {editingHour ? (
                  <>
                    <span
                      onClick={() => {
                        if (editingHour === "reception") setReceptionHour(editHourValue);
                        if (editingHour === "ceremony") setCeremonyHour(editHourValue);
                        setEditingHour(null);
                      }}
                      className="icon"
                      style={{ marginRight: 6 }}
                    >
                      <Icons.SaveIcon title="Save Time" />
                    </span>
                    <span
                      onClick={() => setEditingHour(null)}
                      className="icon"
                    >
                      <Icons.CloseIcon title="Cancel Edit" />
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => {
                        setEditHourValue(receptionHour);
                        setEditingHour("reception");
                      }}
                      className="icon"
                      style={{ marginRight: 6 }}
                    >
                      <Icons.EditIocn title="Edit Reception Time" />
                    </span>
                    <span
                      onClick={() => {
                        setEditHourValue(ceremonyHour);
                        setEditingHour("ceremony");
                      }}
                      className="icon"
                    >
                      <Icons.EditIocn title="Edit Ceremony Time" />
                    </span>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span
        onClick={handleSaveAll}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
          fontSize: 28,
          marginTop: 10,
        }}
        className={styles.buttonRight}
      >
        <Icons.CheckIcon title="Save Texts" className="icon"/>
      </span>

      {loading && <div className={styles.buttonRight}><Icons.LoaderIcon className="spinner"/></div>}
    </div>
  );
}