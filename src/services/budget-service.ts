import apiClient, { CanceledError } from "./api-client";
import { Budget } from "../types";

export { CanceledError };

export const getBudget = () => {
  const request = apiClient.get<Budget>("/budget");
  return { request, abort: () => {} };
};

export const createBudget = (budget: Budget) => {
  const request = apiClient.post<Budget>("/budget", budget);
  return { request, abort: () => {} };
};

export const updateBudget = (budget: Budget) => {
  const request = apiClient.put<Budget>("/budget", budget);
  return { request, abort: () => {} };
};
