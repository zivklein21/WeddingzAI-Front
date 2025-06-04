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

const menuService = {
  // 1. Generate menu background image with AI (returns {backgroundUrl})
  generateBackground: (prompt: string) =>
    apiClient.post<{ backgroundUrl: string }>("/menu/background", { prompt }),

  // 2. Upload a custom background image file
  uploadBackground: (file: File, userId: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("userId", userId);
    return apiClient.post<{ backgroundUrl: string }>("/menu/upload-background", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 3. Create menu (returns Menu with _id)
  createMenu: (
    userId: string,
    coupleNames: string,
    designPrompt: string,
    backgroundUrl: string
  ) =>
    apiClient.post<Menu>("/menu", {
      userId,
      coupleNames,
      designPrompt,
      backgroundUrl,
    }),

  // 4. Get single menu by ID
  getMenu: (userId: string) => apiClient.get<Menu>(`/menu/${userId}`),

  // 5. Update all dishes
  updateDishes: (userId: string, dishes: Dish[]) =>
    apiClient.put<Menu>("/menu/dishes", { userId, dishes }),

  // 6. Save menu design (final PNG & PDF)
  saveMenuFiles: (userId: string, pngBase64: string, pdfBase64: string) =>
    apiClient.put<Menu>("/menu/save", { userId, pngBase64, pdfBase64 }),
};

export default menuService;