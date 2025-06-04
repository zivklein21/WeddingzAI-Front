import apiClient, { CanceledError } from './api-client';

export { CanceledError };

export interface Dish {
  name: string;
  description: string;
}

export interface Menu {
  _id: string;
  userId: string;
  coupleNames: string;
  designPrompt: string;
  dishes: Dish[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuResponse {
  message: string;
  data: Menu;
}

const createMenu = (coupleNames: string, designPrompt: string, dishes: Dish[]) => {
  const controller = new AbortController();
  
  const request = apiClient.post<MenuResponse>(
    '/menu/create',
    { coupleNames, designPrompt, dishes },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    request,
    abort: () => controller.abort()
  };
};

const menuService = {
  createMenu
};

export default menuService; 