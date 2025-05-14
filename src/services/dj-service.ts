// src/services/dj-service.ts

import apiClient, { CanceledError } from "./api-client";
export { CanceledError };

export interface Dj {
  _id: string;
  name: string;
  genre?: string;
  location?: string;
  rate?: number;
  about?: string;
  profileImage?: string;
  coverImage: string;
  contact: {
    email?: string;
    phone?: string;
  };
  // אם יש לך שדות נוספים במודל – הוסף אותם כאן
}

interface BaseResponse<T> {
  message: string;
  data: T;
}

// 1. GET /djs
export const fetchAllDjs = async (): Promise<Dj[]> => {
  const resp = await apiClient.get<BaseResponse<Dj[]>>("/djs");
  return resp.data.data;
};

// 2. GET /djs/:id
export const fetchDjById = async (id: string): Promise<Dj> => {
  const resp = await apiClient.get<BaseResponse<Dj>>(`/djs/${id}`);
  return resp.data.data;
};

// 3. GET /djs/mine
export const fetchMyDjs = async (): Promise<Dj[]> => {
  const resp = await apiClient.get<BaseResponse<Dj[]>>("/djs/mine");
  return resp.data.data;
};

// 4. DELETE /djs/:id
export const deleteDj = async (id: string): Promise<Dj> => {
  const resp = await apiClient.delete<BaseResponse<Dj>>(`/djs/${id}`);
  return resp.data.data;
};

// 5. POST /djs/find
// שולח את listingUrl ומקבל אישור זריקה לעבודה ברקע
export const findDjs = async (
  listingUrl: string
): Promise<{ success: boolean; message: string }> => {
  const resp = await apiClient.post<{ success: boolean; message: string }>(
    "/djs/find",
    { listingUrl }
  );
  return resp.data;
};

// 6. POST /djs/scrape
// שולח URL ספציפי ומקבל את ה-DJ שנוצר
export const scrapeOneDj = async (
  url: string
): Promise<{ success: boolean; dj: Dj }> => {
  const resp = await apiClient.post<{ success: boolean; dj: Dj }>(
    "/djs/scrape",
    { url }
  );
  return resp.data;
};

export default {
  fetchAllDjs,
  fetchDjById,
  fetchMyDjs,
  deleteDj,
  findDjs,
  scrapeOneDj,
};