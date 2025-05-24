// src/services/tdl-service.ts

import apiClient from "./api-client";

// The shape of the raw to-do list JSON your UI expects.
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
    }[];
  }[];
}

// The full document as stored in Mongo
interface TdlDocument {
  _id: string;
  userId: string;
  tdl: TdlData;
  createdAt: string;
}

// Response shape when you upload a new TDL.
interface UploadResponse {
  message: string;
  data: TdlDocument;
}

// Upload PrefFormn to generate TDL
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

// Get Current User TDL
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

// Get TDL by user id
export async function getByUserId(userId: string): Promise<TdlDocument[]> {
  const resp = await apiClient.get<{ message: string; data: TdlDocument[] }>(
    `/tdl/user/${userId}`
  );
  return resp.data.data;
}

// Add new Task
export async function addTask(
  sectionName: string,
  task: string,
  dueDate?: string,
  priority?: "Low" | "Medium" | "High"
): Promise<TdlDocument> {
  const resp = await apiClient.post<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { sectionName, task, dueDate, priority }
  );
  return resp.data.data;
}

// Update Task
export async function updateTask(
  sectionName: string,
  index: number,
  updates: {
    task?: string;
    dueDate?: string;
    priority?: "Low" | "Medium" | "High";
  }
): Promise<TdlDocument> {
  const resp = await apiClient.put<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { sectionName, index, updates }
  );
  return resp.data.data;
}

// Delete Task
export async function deleteTask(
  sectionName: string,
  index: number
): Promise<TdlDocument> {
  const resp = await apiClient.delete<{ message: string; data: TdlDocument }>(
    "/tdl/task",
    { data: {sectionName, index }},   // now allowed
  );
  return resp.data.data;
}

/** Shift every task’s dates & priorities around a brand-new wedding date */
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