import { useState, useEffect } from "react";
import {
  getBudget,
  createBudget,
  updateBudget,
} from "../../services/budget-service";
import { Budget, BudgetCategory } from "../../types/index";

export function useBudget() {
  const [totalBudget, setTotalBudget] = useState("");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBudget, setHasBudget] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getBudget().request;
        if (response.data) {
          setTotalBudget(response.data.totalBudget.toString());
          setCategories(response.data.categories);
          setHasBudget(true);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setTotalBudget("");
          setCategories([]);
          setHasBudget(false);
        } else {
          setError("Failed to load budget.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const saveBudget = async (
    updatedCategories: BudgetCategory[],
    updatedTotalBudget: string
  ) => {
    try {
      const budget: Budget = {
        totalBudget: parseFloat(updatedTotalBudget) || 0,
        categories: updatedCategories,
      };
      if (hasBudget) {
        await updateBudget(budget).request;
      } else {
        await createBudget(budget).request;
        setHasBudget(true);
      }
    } catch {
      setError("Failed to save budget.");
    }
  };

  return {
    totalBudget,
    categories,
    loading,
    error,
    hasBudget,
    setTotalBudget,
    setCategories,
    saveBudget,
  };
}
