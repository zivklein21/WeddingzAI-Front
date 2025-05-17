import {BudgetProvider} from "../components/Budget/BudgetContext";
import { NavBar } from "../components/NavBar/NavBar";
import BudgetContent from "../components/Budget/BudgetContent";

const BudgetPage = () => {

  return (
    <>
      <NavBar title=""/>
      <BudgetProvider>
        <BudgetContent />
      </BudgetProvider>
    </>
  );
};

export default BudgetPage;
