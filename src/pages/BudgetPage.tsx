import { useBudget } from "../components/Budget/useBudget";
import BudgetHeader from "../components/Budget/BudgetHeader";
import CategoryList from "../components/Budget/CategoryList";
import AddCategoryForm from "../components/Budget/AddCategoryForm";
import { NavBar } from "../components/NavBar/NavBar";

const BudgetPage: React.FC = () => {
  const {
    totalBudget,
    categories,
    loading: budgetLoading,
    error,
    hasBudget,
    setTotalBudget,
    setCategories,
    saveBudget,
  } = useBudget();

  if (budgetLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <NavBar />
      <div>
        <h2>Wedding Budget</h2>

        <BudgetHeader
          totalBudget={totalBudget}
          setTotalBudget={setTotalBudget}
          saveBudget={saveBudget}
        />

        <CategoryList
          categories={categories}
          setCategories={setCategories}
          saveBudget={saveBudget}
          totalBudget={totalBudget}
        />

        <AddCategoryForm
          categories={categories}
          setCategories={setCategories}
          saveBudget={saveBudget}
          totalBudget={totalBudget}
        />
      </div>
    </div>
  );
};

export default BudgetPage;
