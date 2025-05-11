import { useState } from "react";
import styles from "./budget.module.css";
import { useBudget } from "./BudgetContext";

const BudgetHeader = () => {
  const { totalBudget, setTotalBudget, saveBudget, categories } = useBudget();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await saveBudget(categories, totalBudget);
    setIsEditing(false);
  };

  return (
    <div className={styles.budgetHeader}>
      <label className={styles.headerLabel}>Total Budget:</label>
      {isEditing ? (
        <>
          <input
            className={styles.budgetInput}
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
          />
          <button className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
        </>
      ) : (
        <>
          <span className={styles.budgetAmount}>
            ${parseFloat(totalBudget || "0").toLocaleString()}
          </span>
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default BudgetHeader;
