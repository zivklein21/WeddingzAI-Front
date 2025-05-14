// src/services/guest-service.ts

import apiClient, { CanceledError } from "./api-client";
export { CanceledError };

export interface Guest {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: "yes" | "no" | "maybe";
}

interface BaseResponse<T> {
  message: string;
  data: T;
}

// 1. GET /guests
export const fetchAllGuests = async (): Promise<Guest[]> => {
  const resp = await apiClient.get<BaseResponse<Guest[]>>("/guests");
  return resp.data.data;
};

// 2. GET /guests/mine
export const fetchMyGuests = async (): Promise<Guest[]> => {
  const resp = await apiClient.get<BaseResponse<Guest[]>>("/guests/mine");
  return resp.data.data;
};

// 3. GET /guests/:id
export const fetchGuestById = async (id: string): Promise<Guest> => {
  const resp = await apiClient.get<BaseResponse<Guest>>(`/guests/${id}`);
  return resp.data.data;
};

// 4. DELETE /guests/:id
export const deleteGuest = async (id: string): Promise<Guest> => {
  const resp = await apiClient.delete<BaseResponse<Guest>>(`/guests/${id}`);
  return resp.data.data;
};

// 5. POST /guests — create guest
export const createGuest = async (guest: {
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: "yes" | "no" | "maybe";
}): Promise<Guest> => {
  const resp = await apiClient.post<BaseResponse<Guest>>("/guests", guest);
  return resp.data.data;
};

export default {
  fetchAllGuests,
  fetchMyGuests,
  fetchGuestById,
  deleteGuest,
  createGuest,
};
