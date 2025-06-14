// src/services/menu-service.ts
import apiClient from "./api-client";

export type Dish = {
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
  generateBackground: async (prompt: string) => {
    try {
      const res = await apiClient.post<{ backgroundUrl: string }>("/menu/background", { prompt });
      return res;
    } catch (error) {
      console.error("[menuService.generateBackground] Error:", error);
      throw error;
    }
  },

  // 2. Create menu with background
  createMenuWithBackground: async (payload: CreateMenuPayload) => {
    try {
      const res = await apiClient.post<Menu>("/menu/create-menu", payload);
      return res;
    } catch (error) {
      console.error("[menuService.createMenuWithBackground] Error:", error);
      throw error;
    }
  },

  // לקבלת תפריט לפי userId
  getMenuByUserId: async (userId: string) => {
  try {
    const res = await apiClient.get(`/menu/${userId}`);
    return res.data;
  } catch (err: unknown) {
  const error = err as { response?: { status?: number } };

  if (error.response?.status === 404) {
    console.info("[MenuService] No menu found for user.");
    return null;
  }

  console.error("[MenuService.getMenuByUserId] Error:", err);
  return null;
}
},

  // לעדכן מנות לפי userId
  updateDishesByUserId: async (userId: string, dishes: Dish[]) => {
    try {
      const res = await apiClient.put<Menu>(`/menu/${userId}/dishes`, { dishes });
      return res;
    } catch (error) {
      console.error("[menuService.updateDishesByUserId] Error:", error);
      throw error;
    }
  },

  updateFinals: async (userId: string, finals: {finalPng: string, finalCanvasJson: string}) => {
    try {
      const res = await apiClient.put<Menu>(`/menu/${userId}/finals`, { finals });
      return res;
    } catch (error) {
      console.error("[menuService.updateFinals] Error:", error);
      throw error;
    }
  }
};

export default menuService;