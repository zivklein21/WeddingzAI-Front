// src/services/tdl-service.ts

import apiClient from "./api-client";

export interface TdlData {
  weddingTodoListName: string;
  firstPartner: string;
  secondPartner: string;
  weddingDate: string;
  estimatedBudget: string;
  sections: {
    sectionName: string;
    todos: {
      _id: string;
      task: string;
      dueDate: string;
      priority?: "Low" | "Medium" | "High";
      aiSent: boolean;
      done: boolean;
    }[];
  }[];
}

interface TdlDocument {
  _id: string;
  userId: string;
  tdl: TdlData;
  createdAt: string;
}

interface UploadResponse {
  message: string;
  data: TdlDocument;
}

export async function uploadFormJson(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await apiClient.post<UploadResponse>(
    "/tdl/upload-form",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return resp.data;
}

export async function fetchMyTdl(): Promise<TdlData> {
  const resp = await apiClient.get<{ message: string; data: TdlDocument[] }>(
    "/tdl/mine"
  );
  const docs = resp.data.data;
  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error("No to-do list found for this user");
  }
  return docs[0].tdl;
}

export async function getByUserId(userId: string): Promise<TdlDocument[]> {
  const resp = await apiClient.get<{ message: string; data: TdlDocument[] }>(
    `/tdl/mine`
  );
  return resp.data.data;
}

export async function addTask(
  task: string,
  dueDate?: string,
  priority?: "Low" | "Medium" | "High"
): Promise<TdlDocument> {
  const resp = await apiClient.post<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { task, dueDate, priority }
  );
  return resp.data.data;
}

export async function updateTask(
  sectionName: string,
  todoId: string,
  updates: {
    task?: string;
    dueDate?: string;
    priority?: "Low" | "Medium" | "High";
    done?: boolean;
  }
): Promise<TdlDocument> {
  const resp = await apiClient.put<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { sectionName, todoId, updates }
  );
  return resp.data.data;
}

export async function deleteTask(
  sectionName: string,
  todoId: string
): Promise<TdlDocument> {
  const resp = await apiClient.delete<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { data: { sectionName, todoId } }
  );
  return resp.data.data;
}

export async function updateWeddingDate(
  newWeddingDate: string
): Promise<TdlDocument> {
  const resp = await apiClient.put<{ message: string; data: TdlDocument }>(
    "/tdl/date",
    { newWeddingDate }
  );
  return resp.data.data;
}

export async function setTaskDone(
  sectionName: string,
  todoId: string,
  done: boolean
): Promise<TdlDocument> {
  const resp = await apiClient.patch<{ message: string; data: TdlDocument }>(
    "/tdl/done",
    { sectionName, todoId, done }
  );
  return resp.data.data;
}

export default {
  uploadFormJson,
  fetchMyTdl,
  addTask,
  updateTask,
  deleteTask,
  updateWeddingDate,
  setTaskDone
};