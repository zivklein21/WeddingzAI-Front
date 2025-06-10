import {BudgetProvider} from "../components/Budget/BudgetContext";
import { NavBar } from "../components/NavBar/NavBar";
import Budget from "../components/Budget/Budget";

const BudgetPage = () => {

  return (
    <>
      <NavBar title=""/>
      <BudgetProvider>
        <Budget />
      </BudgetProvider>
    </>
  );
};

export default BudgetPage;
