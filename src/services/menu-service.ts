// src/services/menu-service.ts
import apiClient, { CanceledError } from './api-client';

export { CanceledError };

export interface Dish {
  _id?: string;
  name: string;
  description: string;
  category: "Starters" | "Intermediates" | "Mains" | "Desserts" | "On the table";
  isVegetarian: boolean;
}

export interface Menu {
  _id: string;
  userId: string;
  coupleNames: string;
  designPrompt: string;
  backgroundUrl: string;
  dishes: Dish[];
}

export interface MenuResponse {
  data: Menu;
}

const menuService = {
  // 1. create background with ai
    generateBackground: (prompt: string) => {
    return apiClient.post<{ backgroundUrl: string }>(
      '/menu/background',
      { prompt }
    );
  },
  
  // 2. create menu with dishes
  createMenu: (userId: string, coupleNames: string, designPrompt: string) => {
    const request = apiClient.post<Menu>(
      '/menu',
      { userId, coupleNames, designPrompt }
    );
    return { request };
  },

  // 3. update all deishes in the menu
  updateDishes: (menuId: string, dishes: Dish[]) => {
    const request = apiClient.put<Menu>(
      '/menu/dishes',
      { menuId, dishes }
    );
    return { request };
  },

  // 4. add new dish to menu
  addDish: (menuId: string, dish: Dish) => {
    const request = apiClient.post<Menu>(
      '/menu/add-dish',
      { menuId, dish }
    );
    return { request };
  },

  // 5. remove dish from menu
  removeDish: (menuId: string, dishId: string) => {
      const request = apiClient.post<Menu>(
      '/menu/remove-dish',
      { menuId, dishId }
    );
    return { request };
  }
};

export default menuService;