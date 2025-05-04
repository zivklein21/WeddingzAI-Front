import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface BudgetCategory {
  name: string;
  amount: number;
}

export interface Budget {
  totalBudget: number;
  categories: BudgetCategory[];
}

// Get user's budget
const getBudget = () => {
  const request = apiClient.get<Budget>('/budget');
  return { request, abort: () => {} };
};

// Create/update budget
const updateBudget = (budget: Budget) => {
  const request = apiClient.post<Budget>('/budget', budget);
  return { request, abort: () => {} };
};

// Delete budget
const deleteBudget = () => {
  const request = apiClient.delete('/budget');
  return { request, abort: () => {} };
};

export default { getBudget, updateBudget, deleteBudget }; 