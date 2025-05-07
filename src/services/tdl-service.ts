// src/services/tdl-service.ts

import apiClient from "./api-client";

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

// The shape of a TDL document as stored in Mongo
interface TdlDocument {
  _id: string;
  userId: string;
  tdl: TdlData;
  createdAt: string;
}

// What the upload endpoint returns
interface UploadResponse {
  message: string;
  data: TdlDocument;
}

// Upload the JSON file and persist it
async function uploadFormJson(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await apiClient.post<UploadResponse>(
    "/upload-form",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return resp.data;
}

// Fetch all of the user's TDL docs, then return the most recent .tdl payload
async function fetchMyTdl(): Promise<TdlData> {
  const resp = await apiClient.get<{ message: string; data: TdlDocument[] }>(
    "/mine"
  );
  const docs = resp.data.data;
  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error("No to-do list found for this user");
  }
  // assume sorted by createdAt descending on the server; otherwise sort here
  return docs[0].tdl;
}

export default {
  uploadFormJson,
  fetchMyTdl,
};