import apiClient from "./api-client";

const API_BASE = "/tables";

export const getAllTables = async () => {
  const response = await apiClient.get(API_BASE);
  return response.data;
};

export const getMyTables = async () => {
  const response = await apiClient.get(`${API_BASE}/mine`);
  return response.data.data;
};

export const getTableById = async (id: string) => {
  const response = await apiClient.get(`${API_BASE}/${id}`);
  return response.data;
};

export const deleteTable = async (id: string) => {
  const response = await apiClient.delete(`${API_BASE}/${id}`);
  return response.data;
};

export const createTable = async (tableData: {
  name: string;
  shape: "round" | "rectangle";
  capacity: number;
  position: { x: number; y: number };
}) => {
  const response = await apiClient.post(API_BASE, tableData);
  return response.data.data;
};

export const updateTable = async (
  id: string,
  updates: Partial<{
    name: string;
    shape: "round" | "rectangle";
    capacity: number;
    position: { x: number; y: number };
    guests: string[];
  }>
) => {
  const response = await apiClient.patch(`${API_BASE}/${id}`, updates);
  return response.data;
};
