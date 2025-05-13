// types.ts

export interface BudgetCategory {
  name: string;
  amount: number;
}

export interface Budget {
  totalBudget: number;
  categories: BudgetCategory[];
}
