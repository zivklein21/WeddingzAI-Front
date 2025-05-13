import { useState } from "react";
import styles from "./budget.module.css";
import { useBudget } from "./BudgetContext";

const AddCategoryForm = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const { categories, setCategories, saveBudget, totalBudget } = useBudget();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount.trim()) return;

    const newCategory = {
      name: name.trim(),
      amount: parseFloat(amount),
    };

    const updated = [...categories, newCategory];
    await saveBudget(updated, totalBudget); // שמירה מדויקת ל-DB
    setCategories(updated); // עדכון מקומי של state
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
