// src/services/tdl-service.ts

import apiClient from "./api-client";

/**
 * The shape of the raw to-do list JSON your UI expects.
 */
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
      priority: string;
    }[];
  }[];
}

/**
 * The full document as stored in Mongo.
 */
interface TdlDocument {
  _id: string;
  userId: string;
  tdl: TdlData;
  createdAt: string;
}

/**
 * Response shape when you upload a new TDL.
 */
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

export default {
  uploadFormJson,
  fetchMyTdl,
  getByUserId
};