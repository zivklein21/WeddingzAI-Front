// BudgetHeader.tsx
import React, { useState, useMemo } from "react";
import styles from "./Budget.module.css";
import { useBudget } from "./BudgetContext";
import {FiEdit2, FiSave, FiUpload} from 'react-icons/fi';
import { exportToCSV } from "../../utils/export-to-csv";


export default function BudgetHeader() {
  const { totalBudget, setTotalBudget, saveBudget, categories } = useBudget();
  const [isEditing, setIsEditing] = useState(false);

  // calculate spent & remaining
  const { spent, remaining } = useMemo(() => {
    const s = categories.reduce((sum, c) => sum + (c.amount || 0), 0);
    const rem = (parseFloat(totalBudget) || 0) - s;
    return { spent: s, remaining: rem };
  }, [categories, totalBudget]);

  const handleSave = async () => {
    await saveBudget(categories, totalBudget);
    setIsEditing(false);
  };

  const handleExport = () => {
      const budgetData = categories.map(({ name, amount }) => ({ name, amount }));
      const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
      const remaining = parseFloat(totalBudget) - totalSpent;
  
      budgetData.push(
        { name: "Total Spent", amount: totalSpent },
        { name: "Remaining Budget", amount: remaining }
      );
  
      exportToCSV(budgetData, ["name", "amount"], "wedding-budget.csv");
    };

  return (
    <div className={styles.totalContainer}>
      <div className={styles.headerStats}>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Total Budget:</label>
          {isEditing ? (
            <>
              <input
                className={styles.budgetInput}
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
              />
              <FiSave className={styles.actionIcon} onClick={handleSave}/>
            </>
          ) : (
            <>
              <span className={styles.statValue}>
                ${parseFloat(totalBudget || "0").toLocaleString()}
              </span>
              <FiEdit2  className={styles.actionIcon} onClick={()=>setIsEditing(true)}/>
            </>
          )}
        </div>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Spent:</label>
          <span className={styles.statValue}>
            ${spent.toLocaleString()}
          </span>
        </div>
        <div className={styles.statItem}>
          <label className={styles.statLabel}>Remaining:</label>
          <span className={styles.statValue}>
            ${remaining.toLocaleString()}
          </span>
        </div>
        <div className={styles.statItem}>
          <FiUpload className={styles.actionIcon} onClick={handleExport}/>
        </div>
      </div>
    </div>
  );
}