import { useState } from "react";
import styles from "./budget.module.css";
import { useBudget } from "./BudgetContext";

const CategoryList = () => {
  const { categories, setCategories, saveBudget, totalBudget } = useBudget();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");

  const handleDelete = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    saveBudget(updated, totalBudget);
  };

  const handleUpdate = (index: number) => {
    const updated = categories.map((item, i) =>
      i === index
        ? { name: editedName, amount: parseFloat(editedAmount) || 0 }
        : item
    );
    setCategories(updated);
    saveBudget(updated, totalBudget);
    setEditIndex(null);
  };

  if (categories.length === 0) {
    return <p className={styles.emptyMessage}>No categories yet.</p>;
  }

  return (
    <>
      <ul className={styles.categoryList}>
        {categories.map((cat, index) => {
          const isEditing = editIndex === index;

          return (
            <li key={index} className={styles.categoryItem}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className={styles.categoryInput}
                  />
                  <input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    className={styles.categoryInput}
                  />
                  <button
                    className={styles.confirmBtn}
                    onClick={() => handleUpdate(index)}
                    title="Confirm"
                  >
                    ✔
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setEditIndex(null)}
                    title="Cancel"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryAmount}>${cat.amount}</span>
                  <div className={styles.categoryActions}>
                    <button
                      className={styles.categoryEditBtn}
                      onClick={() => {
                        setEditIndex(index);
                        setEditedName(cat.name);
                        setEditedAmount(cat.amount.toString());
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(index)}
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <p className={styles.totalRow}>
        Total Spent: $
        {categories
          .reduce((sum, cat) => sum + (Number(cat.amount) || 0), 0)
          .toLocaleString()}
      </p>
      <p className={styles.totalRow}>
        Remaining Budget: $
        {(
          parseFloat(totalBudget) -
          categories.reduce((sum, cat) => sum + (Number(cat.amount) || 0), 0)
        ).toLocaleString()}
      </p>
    </>
  );
};

export default CategoryList;
