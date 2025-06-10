import React from "react";
import BudgetHeader from "./BudgetHeader";
import AddCategoryForm from "./AddCategoryForm";
import CategoryList from "./CategoryList";
import { useNavigate } from "react-router-dom";
import * as Icons from "../../icons/index";
import { ToastContainer } from 'react-toastify';

const Budget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pageMain">
      <div className="pageContainer">
        <h2 className="pageHeader">Budget</h2>
        <Icons.BackArrowIcon className="backIcon" title="Go Back" onClick={() => navigate(-1)}/>
          <BudgetHeader />
          <AddCategoryForm />
          <CategoryList />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Budget;