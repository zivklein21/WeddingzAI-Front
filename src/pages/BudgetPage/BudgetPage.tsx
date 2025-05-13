import {
  BudgetProvider,
  useBudget,
} from "../../components/Budget/BudgetContext";
import BudgetHeader from "../../components/Budget/BudgetHeader";
import CategoryList from "../../components/Budget/CategoryList";
import AddCategoryForm from "../../components/Budget/AddCategoryForm";
import { NavBar } from "../../components/NavBar/NavBar";
import { exportToCSV } from "../../utils/export-to-csv";
import styles from "./BudgetPage.module.css";

const BudgetPage: React.FC = () => {
  return (
    <BudgetProvider>
      <InnerBudgetPage />
    </BudgetProvider>
  );
};

const InnerBudgetPage = () => {
  const { categories, totalBudget } = useBudget();

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <div>
        <div id="budget-export">
          <BudgetHeader />
          <AddCategoryForm />
          <CategoryList />
        </div>
        <button
          className={styles.exportBtn}
          onClick={() => {
            const budgetData = categories.map(({ name, amount }) => ({
              name,
              amount,
            }));

            const totalSpent = categories.reduce(
              (sum, cat) => sum + (Number(cat.amount) || 0),
              0
            );
            const remaining = parseFloat(totalBudget) - totalSpent;

            budgetData.push(
              { name: "Total Spent", amount: totalSpent },
              { name: "Remaining Budget", amount: remaining }
            );

            exportToCSV(budgetData, ["name", "amount"], "wedding-budget.csv");
          }}
        >
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default BudgetPage;
