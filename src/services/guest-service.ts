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

export interface GuestContact {
  fullName: string;
  email: string;
  guestId: string;
  rsvpToken: string;
}

// 1. GET all guests
export const fetchAllGuests = async (): Promise<Guest[]> => {
  const resp = await apiClient.get<BaseResponse<Guest[]>>("/guests");
  return resp.data.data;
};

// 2. GET my guests
export const fetchMyGuests = async (): Promise<Guest[]> => {
  const resp = await apiClient.get<BaseResponse<Guest[]>>("/guests/mine");
  return resp.data.data;
};

// 3. GET single guest
export const fetchGuestById = async (id: string): Promise<Guest> => {
  const resp = await apiClient.get<BaseResponse<Guest>>(`/guests/${id}`);
  return resp.data.data;
};

// 4. DELETE guest
export const deleteGuest = async (id: string): Promise<Guest> => {
  const resp = await apiClient.delete<BaseResponse<Guest>>(`/guests/${id}`);
  return resp.data.data;
};

// 5. POST guest
export const createGuest = async (guest: {
  fullName: string;
  email: string;
  phone?: string;
  rsvp?: "yes" | "no" | "maybe";
}): Promise<Guest> => {
  const resp = await apiClient.post<BaseResponse<Guest>>("/guests", guest);
  return resp.data.data;
};

// 6. PUT guest (update)
export const updateGuest = async (
  id: string,
  guest: {
    fullName: string;
    email: string;
    phone?: string;
    rsvp?: "yes" | "no" | "maybe";
  }
): Promise<Guest> => {
  const resp = await apiClient.put<BaseResponse<Guest>>(`/guests/${id}`, guest);
  return resp.data.data;
};

// 7. POST invitations with full guest data
export const sendInvitationToAllGuests = async (data: {
  partner1: string;
  partner2: string;
  weddingDate: string;
  guests: GuestContact[];
}): Promise<void> => {
  const resp = await apiClient.post<BaseResponse<null>>("/guests/send-invitation", data);
  if (resp.status !== 200) {
    throw new Error(resp.data.message || "Failed to send invitations");
  }
};

export default {
  fetchAllGuests,
  fetchMyGuests,
  fetchGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  sendInvitationToAllGuests,
};
