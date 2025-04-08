import Budget from "../components/Budget/Budget";
import { NavBar } from "../components/NavBar/NavBar";

const BudgetPage: React.FC = () => {
    return (
      <div>
          <NavBar />
        <Budget />
      </div>
    );
  };
  
  export default BudgetPage;
  