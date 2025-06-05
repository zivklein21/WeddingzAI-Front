// src/services/menu-service.ts
import apiClient from "./api-client";

export type Dish = {
  _id: string;
  name: string;
  description: string;
  isVegetarian?: boolean;
  category: "Starters" | "Intermediates" | "Mains" | "Desserts" | "On the table";
};

export interface Menu {
  userId: string;
  coupleNames: string;
  designPrompt: string;
  backgroundUrl: string;
  dishes: Dish[];
  finalPng?: string;
  finalPdf?: string;
}

interface CreateMenuPayload {
  userId: string;
  coupleNames: string;
  designPrompt: string;
  backgroundUrl: string; 
}

const menuService = {
  // 1. Generate menu background image with AI (returns {backgroundUrl})
  generateBackground: (prompt: string) =>
    apiClient.post<{ backgroundUrl: string }>("/menu/background", { prompt }),

  // 2. Create menu with background
  createMenuWithBackground: (payload: CreateMenuPayload) => {
    return apiClient.post<Menu>("/menu/create-menu", payload);
  },
};

export default menuService;