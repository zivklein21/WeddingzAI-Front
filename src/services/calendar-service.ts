import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

const API_BASE = "/calendar";

export const getEvents = (userId: string) => {
  const request = apiClient.get(`${API_BASE}/${userId}/events`);
  return { request, abort: () => {} };
};

export const createEvent = (userId: string, eventData: any) => {
  const request = apiClient.post(`${API_BASE}/${userId}/events`, eventData);
  return { request, abort: () => {} };
};

export const updateEvent = (userId: string, eventId: string, eventData: any) => {
  const request = apiClient.put(`${API_BASE}/${userId}/events/${eventId}`, eventData);
  return { request, abort: () => {} };
};

export const deleteEvent = (userId: string, eventId: string) => {
  const request = apiClient.delete(`${API_BASE}/${userId}/events/${eventId}`);
  return { request, abort: () => {} };
};