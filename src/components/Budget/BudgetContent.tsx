import React from "react";
import BudgetHeader from "./BudgetHeader";
import AddCategoryForm from "./AddCategoryForm";
import CategoryList from "./CategoryList";
import styles from "./Budget.module.css";
import {FiArrowLeft} from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const BudgetContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.budgetPage}>
      <div className={styles.budgetContainer}>
        <FiArrowLeft
          className={styles.backIcon}
          onClick={() => navigate(-1)}
          title="Go Back"
        />

        <h2 className={styles.budgetHeader}>Budget</h2>
          <BudgetHeader />
          <AddCategoryForm />
          <CategoryList />
      </div>
    </div>
  );
};

export default BudgetContent;