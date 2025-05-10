// src/services/tdl-service.ts

import apiClient from "./api-client";

/**
 * The shape of the raw to-do list JSON your UI expects.
 */
export interface TdlData {
  weddingTodoListName: string;
  bride: string;
  groom: string;
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

/**
 * Uploads the user’s preferences JSON file to the server.
 * Server generates a TDL, saves it under their userId, and returns the saved doc.
 */
export async function uploadFormJson(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await apiClient.post<UploadResponse>(
    "/upload-form",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return resp.data;
}

/**
 * Fetches all TDL documents for the current user via GET /tdl/mine,
 * then returns the most recent document’s `.tdl` payload.
 */
export async function fetchMyTdl(): Promise<TdlData> {
  const resp = await apiClient.get<{ message: string; data: TdlDocument[] }>(
    "/mine"
  );
  const docs = resp.data.data;
  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error("No to-do list found for this user");
  }
  // If your server doesn't already sort, you can sort by createdAt here.
  return docs[0].tdl;
}

export default {
  uploadFormJson,
  fetchMyTdl,
};