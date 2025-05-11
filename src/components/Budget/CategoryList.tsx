import styles from "./budget.module.css";

interface Category {
  name: string;
  amount: number;
}

interface CategoryListProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  saveBudget: (categories: Category[], totalBudget: string) => Promise<void>;
  totalBudget: string;
}

const CategoryList = ({
  categories,
  setCategories,
  saveBudget,
  totalBudget,
}: CategoryListProps) => {
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
        {categories.map((cat, index) => (
          <li key={index} className={styles.categoryItem}>
            <span className={styles.categoryName}>{cat.name}</span>
            <span className={styles.categoryAmount}>${cat.amount}</span>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(index)}
            >
              ✕
            </button>
          </li>
        ))}
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
