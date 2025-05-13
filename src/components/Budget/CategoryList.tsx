import { useState } from "react";
import styles from "./budget.module.css";
import { useBudget } from "./BudgetContext";

const CategoryList = () => {
  const { categories, setCategories, saveBudget, totalBudget } = useBudget();

  const handleDelete = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    saveBudget(updated, totalBudget);
  };

  if (categories.length === 0) {
    return <p className={styles.emptyMessage}>No categories yet.</p>;
  }

  return (
    <>
      <ul className={styles.categoryList}>
        {categories.map((cat, index) => {
          const [isEditing, setIsEditing] = useState(false);
          const [editedName, setEditedName] = useState(cat.name);
          const [editedAmount, setEditedAmount] = useState(
            cat.amount.toString()
          );

          const handleUpdate = () => {
            const updated = categories.map((item, i) =>
              i === index
                ? { name: editedName, amount: parseFloat(editedAmount) || 0 }
                : item
            );
            setCategories(updated);
            saveBudget(updated, totalBudget);
            setIsEditing(false);
          };

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
                    onClick={handleUpdate}
                    title="Confirm"
                  >
                    ✔
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
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
                        setEditedName(cat.name);
                        setEditedAmount(cat.amount.toString());
                        setIsEditing(true);
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
    </>
  );
};

export default CategoryList;
