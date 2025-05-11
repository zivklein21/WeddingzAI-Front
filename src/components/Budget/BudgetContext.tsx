import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getBudget,
  createBudget,
  updateBudget,
} from "../../services/budget-service";

export interface BudgetCategory {
  name: string;
  amount: number;
}

export interface Budget {
  totalBudget: number;
  categories: BudgetCategory[];
}

interface BudgetContextType {
  totalBudget: string;
  categories: BudgetCategory[];
  loading: boolean;
  error: string | null;
  hasBudget: boolean;
  setTotalBudget: (value: string) => void;
  setCategories: (categories: BudgetCategory[]) => void;
  saveBudget: (
    categories: BudgetCategory[],
    totalBudget: string
  ) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
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
        await updateBudget(budget);
      } else {
        await createBudget(budget);
        setHasBudget(true);
      }
    } catch (error) {
      console.error("Failed to save budget:", error);
      setError("Failed to save budget.");
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        totalBudget,
        categories,
        loading,
        error,
        hasBudget,
        setTotalBudget,
        setCategories,
        saveBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
