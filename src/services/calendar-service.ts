import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

const API_BASE = "/calendar";

type CalendarEventData = {
  title: string;
  date: string;
  description?: string;
  color?: string;
};

type CalendarEvent = {
  _id: string;
  title: string;
  date: string;
  color?: string;
};

export const getEvents = async (userId: string) => {
  try {
    return await apiClient.get<CalendarEvent[]>(`${API_BASE}/${userId}/events`);
  } catch (error) {
    console.error("[CalendarService.getEvents] Error:", error);
    throw error;
  }
};

export const createEvent = async (userId: string, eventData: CalendarEventData) => {
  try {
    return await apiClient.post(`${API_BASE}/${userId}/events`, eventData);
  } catch (error) {
    console.error("[CalendarService.createEvent] Error:", error);
    throw error;
  }
};

export const updateEvent = async (userId: string, eventId: string, eventData: CalendarEventData) => {
  try {
    return await apiClient.put(`${API_BASE}/${userId}/events/${eventId}`, eventData);
  } catch (error) {
    console.error("[CalendarService.updateEvent] Error:", error);
    throw error;
  }
};

export const deleteEvent = async (userId: string, eventId: string) => {
  try {
    return await apiClient.delete(`${API_BASE}/${userId}/events/${eventId}`);
  } catch (error) {
    console.error("[CalendarService.deleteEvent] Error:", error);
    throw error;
  }
};