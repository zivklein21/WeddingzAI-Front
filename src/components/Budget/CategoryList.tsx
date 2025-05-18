import { useState } from "react";
import styles from "./Budget.module.css";
import { useBudget } from "./BudgetContext";

import {
  FiCheck,
  FiX,
  FiEdit2,
  FiSave,
  FiTrash2
} from 'react-icons/fi';


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

  return (
    <>
    <hr style={{ margin: '32px 0 12px 0', border: 'none', borderTop: '1.5px solid #e3e3e3' }} />
      <div
      className={
        categories.length === 0
          ? styles.tableWrapperEmpty
          : styles.tableWrapper
      }
    >
      {categories.length === 0 ? (
      <p className={styles.emptyMessage}>No categories yet.</p>
    ) : (
        <table className={styles.categoriesTable}>
          <tbody>
            {categories.map((cat, index) => {
              const isEditing = editIndex === index;

              return (
                <tr key={index}>
                  {isEditing ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className={styles.tableInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editedAmount}
                          onChange={(e) => setEditedAmount(e.target.value)}
                          className={styles.tableInput}
                        />
                      </td>
                      <td>
                        <FiCheck className={styles.actionIcon} onClick={() => handleUpdate(index)}/>
                        <FiX className={styles.actionIcon} onClick={() => setEditIndex(null)} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.name}>
                        {cat.name}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <span className={styles.amount}>${cat.amount}</span>
                          <FiEdit2 
                            onClick={() => {
                              setEditIndex(index);
                              setEditedName(cat.name);
                              setEditedAmount(cat.amount.toString());
                            }}
                            className={styles.actionIcon}
                          />
                          <FiTrash2 className={styles.actionIcon} onClick={() => handleDelete(index)}/>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
    )}</div>
    </>
  );
};

export default CategoryList;
