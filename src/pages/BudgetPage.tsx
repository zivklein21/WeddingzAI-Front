import { BudgetProvider } from "../components/Budget/BudgetContext";
import BudgetHeader from "../components/Budget/BudgetHeader";
import CategoryList from "../components/Budget/CategoryList";
import AddCategoryForm from "../components/Budget/AddCategoryForm";
import { NavBar } from "../components/NavBar/NavBar";

const BudgetPage: React.FC = () => {
  return (
    <BudgetProvider>
      <div>
        <NavBar />
        <div>
          <h2>Wedding Budget</h2>
          <BudgetHeader />
          <CategoryList />
          <AddCategoryForm />
        </div>
      </div>
    </BudgetProvider>
  );
};

export default BudgetPage;
