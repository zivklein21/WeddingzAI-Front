// src/components/TodoList/TodoList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import vendorService from "../../services/vendor-service";
import {
  FiArrowLeft,
  FiEdit2,
  FiSave,
  FiLoader
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import TodoSection, { Todo as TodoType } from "./ToDoSection";
import { TaskModal, TaskData } from "./TaskModal";
import { ConfirmDeleteModal } from "./DeleteTaskModal";
import styles from "./TodoList.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TodoList() {
  const [todoList, setTodoList] = useState<TdlData | null>(null);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [weddingDateInput, setWeddingDateInput] = useState("");
  const [isSavingDate, setIsSavingDate] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addSectionIdx, setAddSectionIdx] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<{
    section: number;
    index: number;
    data: TaskData;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    section: number;
    index: number;
    text: string;
  } | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const list = await tdlService.fetchMyTdl();
        setTodoList(list);
        setWeddingDateInput(list.weddingDate);
        const init: Record<number, boolean> = {};
        list.sections.forEach((_, i) => (init[i] = true));
        setOpenSections(init);
      } catch (err: any) {
        setError(err.message || "Could not load your to-do list.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleAIButtonClick = async (task: string) => {
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
    try {
      await vendorService.startAIResearchBackground(task, user._id);
      toast.success("Sent to AI for vendor research");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send to AI");
    }
  };

  const toggleSection = (idx: number) =>
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleSaveWeddingDate = async () => {
    setIsSavingDate(true);
    try {
      await tdlService.updateWeddingDate(weddingDateInput);
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      setWeddingDateInput(fresh.weddingDate);
      setIsEditingDate(false);
      toast.success("Wedding date updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wedding date");
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleAddSave = async (data: TaskData) => {
    if (!todoList || addSectionIdx === null) return;
    try {
      const sectionName = todoList.sections[addSectionIdx].sectionName;
      await tdlService.addTask(sectionName, data.text, data.dueDate, data.priority);
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      toast.success("Task added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    } finally {
      setAddModalOpen(false);
      setAddSectionIdx(null);
    }
  };

  const handleEditSave = async (data: TaskData) => {
    if (!todoList || !editModal) return;
    try {
      const { section, index } = editModal;
      const sectionName = todoList.sections[section].sectionName;
      await tdlService.updateTask(sectionName, index, {
        task: data.text,
        dueDate: data.dueDate,
        priority: data.priority
      });
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      toast.success("Task updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    } finally {
      setEditModal(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!todoList || !deleteModal) return;
    try {
      const { section, index } = deleteModal;
      const sectionName = todoList.sections[section].sectionName;
      await tdlService.updateTask(sectionName, index, { deleted: true });
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      toast.success("Task marked as deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark task as deleted");
    } finally {
      setDeleteModal(null);
    }
  };

  const handleToggleDone = async (sectionIdx: number, taskIdx: number, done: boolean) => {
    try {
      const sectionName = todoList!.sections[sectionIdx].sectionName;
      await tdlService.updateTask(sectionName, taskIdx, { done });
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      toast.success(done ? "Marked as done" : "Marked as not done");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task status");
    }
  };

  if (loading)
    return (
      <p className={styles.loading}>
        <FiLoader className={styles.spinner} />
      </p>
    );
  if (error) return <p className={styles.error}>{error}</p>;
  if (!todoList) return null;

  const modalSectionName = editModal
    ? todoList.sections[editModal.section].sectionName
    : addSectionIdx !== null
    ? todoList.sections[addSectionIdx].sectionName
    : "";

  const deleteSectionName = deleteModal
    ? todoList.sections[deleteModal.section].sectionName
    : "";
  const deleteIndex = deleteModal?.index ?? 0;

  return (
    <>
      <div className={styles.tdlPage}>
        <div className={styles.tdlContainer}>
          <FiArrowLeft
            className={styles.backIcon}
            onClick={() => navigate(-1)}
            title="Go Back"
          />
          <h2 className={styles.tdlHeader}>To Do List</h2>

          <div className={styles.wedDetails}>
            <p className={styles.coupleNames}>
              💍 {todoList.firstPartner} & {todoList.secondPartner}
            </p>
            <p className={styles.weddingDate}>
              📅 Wedding Date:{" "}
              {isEditingDate ? (
                <>
                  <input
                    type="date"
                    className={styles.budgetInput}
                    value={weddingDateInput}
                    onChange={(e) => setWeddingDateInput(e.target.value)}
                    disabled={isSavingDate}
                  />
                  {isSavingDate ? (
                    <span className={styles.savingText}>Saving…</span>
                  ) : (
                    <FiSave
                      className={styles.actionIcon}
                      onClick={handleSaveWeddingDate}
                    />
                  )}
                </>
              ) : (
                <>
                  <strong>{todoList.weddingDate}</strong>
                  <FiEdit2
                    className={styles.actionIcon}
                    onClick={() => setIsEditingDate(true)}
                  />
                </>
              )}
            </p>
          </div>

          <div className={styles.tdlSection}>
            {todoList.sections.map((section, idx) => (
              <TodoSection
                key={idx}
                sectionName={section.sectionName}
                todos={(section.todos as TodoType[])}
                isOpen={openSections[idx]}
                onToggle={() => toggleSection(idx)}
                onEdit={(i) =>
                  setEditModal({
                    section: idx,
                    index: i,
                    data: {
                      id: `${idx}-${i}`,
                      text: section.todos[i].task,
                      dueDate: section.todos[i].dueDate,
                      priority: section.todos[i].priority,
                      aiSent: section.todos[i].aiSent,
                      done: section.todos[i].done,
                      deleted: section.todos[i].deleted,
                    }
                  })
                }
                onRunAI={(task) => handleAIButtonClick(task)}
                onDelete={(i) =>
                  setDeleteModal({
                    section: idx,
                    index: i,
                    text: section.todos[i].task
                  })
                }
                onNewTask={() => {
                  setAddSectionIdx(idx);
                  setAddModalOpen(true);
                }}
                onToggleDone={(taskIdx, done) => handleToggleDone(idx, taskIdx, done)}

              />
            ))}
          </div>
        </div>

        <TaskModal
          sectionName={modalSectionName}
          isOpen={addModalOpen || !!editModal}
          mode={editModal ? "edit" : "add"}
          initial={editModal?.data}
          onSave={(data) => (editModal ? handleEditSave(data) : handleAddSave(data))}
          onCancel={() => {
            setEditModal(null);
            setAddModalOpen(false);
            setAddSectionIdx(null);
          }}
        />

        <ConfirmDeleteModal
          sectionName={deleteSectionName}
          index={deleteIndex}
          isOpen={!!deleteModal}
          taskText={deleteModal?.text || ""}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      </div>

      <ToastContainer position="bottom-right" />
    </>
  );
}
