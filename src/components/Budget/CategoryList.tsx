import { useState } from "react";
import styles from "./Budget.module.css";
import { useBudget } from "./BudgetContext";
import * as Icons from "../../icons/index";
import { toast } from 'react-toastify';



const CategoryList = () => {
  const { categories, setCategories, saveBudget, totalBudget } = useBudget();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");

  const handleDelete = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    saveBudget(updated, totalBudget);
    toast.success("Category Deleted");
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
    toast.success("Category Updated");
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
                        <Icons.CheckIcon className="icon" onClick={() => handleUpdate(index)} title="Save Category"/>
                        <Icons.CloseIcon className="icon" onClick={() => setEditIndex(null)} title="Cancle Edit"/>
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
                          <Icons.EditIocn 
                            onClick={() => {
                              setEditIndex(index);
                              setEditedName(cat.name);
                              setEditedAmount(cat.amount.toString());
                            }}
                            className="icon"
                            title="Edit Category"
                          />
                          <Icons.DeleteIcon className="icon" onClick={() => handleDelete(index)} title="Delete Category"/>
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
