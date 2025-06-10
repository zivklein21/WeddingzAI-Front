import { useState } from "react";
import styles from "./Budget.module.css";
import { useBudget } from "./BudgetContext";
import * as Icons from "../../icons/index";
import { toast } from "react-toastify";

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
    await saveBudget(updated, totalBudget);
    setCategories(updated);
    setName("");
    setAmount("");
    toast.success("Category Added")
  };

  return (
    <form className={styles.addCategoryForm}>
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}        
      />
      <span onClick={handleSubmit} className="icon" >
        <Icons.AddIcon title="Add Category"/>
      </span>
    </form>
  );
};

export default AddCategoryForm;
