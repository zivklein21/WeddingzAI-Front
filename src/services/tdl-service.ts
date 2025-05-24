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
      task: string;
      dueDate: string;
      priority?: "low" | "medium" | "high";
      aiSent: boolean;
      done: boolean;
      deleted?: boolean; // ← soft delete flag
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
    `/tdl/user/${userId}`
  );
  return resp.data.data;
}

export async function addTask(
  sectionName: string,
  task: string,
  dueDate?: string,
  priority?: "Low" | "Medium" | "High",
  deleted?: boolean // ← add this
): Promise<TdlDocument> {
  const resp = await apiClient.post<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { sectionName, task, dueDate, priority, deleted } 
  );
  return resp.data.data;
}


export async function updateTask(
  sectionName: string,
  index: number,
  updates: {
    task?: string;
    dueDate?: string;
    priority?: "Low" | "Medium" | "High";
    done?: boolean;
    deleted?: boolean;
  }
): Promise<TdlDocument> {
  const resp = await apiClient.put<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { sectionName, index, updates }
  );
  return resp.data.data;
}

export async function deleteTask(
  sectionName: string,
  index: number
): Promise<TdlDocument> {
  return updateTask(sectionName, index, { deleted: true });
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

export default {
  uploadFormJson,
  fetchMyTdl,
  getByUserId,
  addTask,
  updateTask,
  deleteTask,
  updateWeddingDate,
};
