import { useState } from "react";
import styles from "./budget.module.css";

interface Category {
  name: string;
  amount: number;
}

interface AddCategoryFormProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  saveBudget: (categories: Category[], totalBudget: string) => Promise<void>;
  totalBudget: string;
}

const AddCategoryForm = ({
  categories,
  setCategories,
  saveBudget,
  totalBudget,
}: AddCategoryFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount.trim()) return;

    const newCategory = {
      name: name.trim(),
      amount: parseFloat(amount),
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    saveBudget(updated, totalBudget);
    setName("");
    setAmount("");
  };

  return (
    <form className={styles.addCategoryForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.categoryInput}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.categoryInput}
      />
      <button type="submit" className={styles.addBtn}>
        Add
      </button>
    </form>
  );
};

export default AddCategoryForm;
