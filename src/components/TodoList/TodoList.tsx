// src/components/TodoList/TodoList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tdlService, { TdlData } from "../../services/tdl-service";
import vendorService from "../../services/vendor-service";
import * as Icons from "../../icons/index";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import TodoSection, { Todo as TodoType } from "./ToDoSection";
import { AddTaskModal, EditTaskModal, TaskData } from "./TaskModal";
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
    todoId: string;
    data: TaskData;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    section: number;
    todoId: string;
    text: string;
  } | null>(null);

  const navigate = useNavigate();
  const { user, updateUserSession } = useAuth();

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
    const result = await vendorService.startAIResearchBackground(task, user._id);

    if (!result.success) {
      if (result.errorCode === "NO_VENDOR_TYPE_FOUND") {
        toast.error("Cannot send this task to AI");
      } else {
        toast.error(result.error || "Failed to send task to AI.");
      }
      return;
    }

    toast.success("Task sent to AI!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to send task to AI (network error).");
  }
};

  const toggleSection = (idx: number) =>
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleSaveWeddingDate = async () => {
    setIsSavingDate(true);
    try {
      await tdlService.updateWeddingDate(weddingDateInput);
      updateUserSession({
        ...user,
        weddingDate: weddingDateInput
      });
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
      await tdlService.addTask(data.text, data.dueDate, data.priority);
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
      const { section, todoId } = editModal;
      const sectionName = todoList.sections[section].sectionName;
      await tdlService.updateTask(sectionName, todoId, {
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
      const { section, todoId } = deleteModal;
      const sectionName = todoList.sections[section].sectionName;
      await tdlService.deleteTask(sectionName, todoId);
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    } finally {
      setDeleteModal(null);
    }
  };

  const handleToggleDone = async (sectionIdx: number, todoIdx: number, done: boolean) => {
    if (!todoList) return;
    try {
      const section = todoList.sections[sectionIdx];
      const todoId = section.todos[todoIdx]._id;
      await tdlService.setTaskDone(section.sectionName, todoId, done);
      const fresh = await tdlService.fetchMyTdl();
      setTodoList(fresh);
      toast.success(done ? "Task marked as done" : "Task marked as not done");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task status");
    }
  };

  if (loading)
    return (
      <p className={styles.loading}>
        <Icons.LoaderIcon className="spinner" />
      </p>
    );
  if (error) return <p className={styles.error}>{error}</p>;
  if (!todoList) return null;

  const deleteSectionName = deleteModal
    ? todoList.sections[deleteModal.section].sectionName
    : "";

  return (
    <>
      <div className="pageMain">
        <div className="pageContainer">
          <Icons.BackArrowIcon
            className="backIcon"
            onClick={() => navigate(-1)}
            title="Go Back"
          />
          <h2 className="pageHeader">To Do List</h2>
          <div className={styles.headerRow}>
            <div className={styles.wedDetails}>
              <p className={styles.coupleNames}>
                <strong><Icons.RingIcon className="icon"/> Couple Names:{" "}</strong>
                 {todoList.firstPartner} & {todoList.secondPartner}
              </p>
              <p className={styles.weddingDate}>
                <strong><Icons.DateIcon className="icon"/>Wedding Date:{" "}</strong>
                {isEditingDate ? (
                  <>
                    <input
                      type="date"
                      value={weddingDateInput}
                      onChange={(e) => setWeddingDateInput(e.target.value)}
                      disabled={isSavingDate}
                    />
                    {isSavingDate ? (
                      <span><Icons.LoaderIcon className="spinner"/></span>
                    ) : (
                      <Icons.SaveIcon
                        className="icon"
                        onClick={handleSaveWeddingDate}
                        title="Save Wedding Date"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {todoList.weddingDate}
                    <Icons.EditIocn
                      className="icon"
                      onClick={() => setIsEditingDate(true)}
                      title="Edit Wedding Date"
                    />
                  </>
                )}
              </p>
            </div>
            <span onClick={() => {
    setAddSectionIdx(0); // or any default section index
    setAddModalOpen(true);}} className="icon" ><Icons.AddIcon title="Add Task"/></span>
          </div>
          

          <div className={styles.tdlSection}>
            {todoList.sections.map((section, idx) => (
              <TodoSection
                key={idx}
                sectionName={section.sectionName}
                todos={section.todos as TodoType[]}
                isOpen={openSections[idx]}
                onToggle={() => toggleSection(idx)}
                onToggleDone={(i, done) => handleToggleDone(idx, i, done)}
                onEdit={(i) =>
                  setEditModal({
                    section: idx,
                    todoId: section.todos[i]._id,
                    data: {
                      id: section.todos[i]._id,
                      text: section.todos[i].task,
                      dueDate: section.todos[i].dueDate,
                      priority: section.todos[i].priority,
                      aiSent: section.todos[i].aiSent
                    }
                  })
                }
                onRunAI={(task) => handleAIButtonClick(task)}
                onDelete={(i) =>
                  setDeleteModal({
                    section: idx,
                    todoId: section.todos[i]._id,
                    text: section.todos[i].task
                  })
                }
              />
            ))}
          </div>
        </div>

        <AddTaskModal
          sectionName={addSectionIdx !== null ? todoList.sections[addSectionIdx].sectionName : ""}
          isOpen={addModalOpen}
          onSave={handleAddSave}
          onCancel={() => {
            setAddModalOpen(false);
            setAddSectionIdx(null);
          }}
        />

        {editModal && (
          <EditTaskModal
            sectionName={todoList.sections[editModal.section].sectionName}
            isOpen={true}
            todoId={editModal.todoId}
            initial={editModal.data}
            onSave={handleEditSave}
            onCancel={() => setEditModal(null)}
          />
        )}

        <ConfirmDeleteModal
          sectionName={deleteSectionName}
          index={0}
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