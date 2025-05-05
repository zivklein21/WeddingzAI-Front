import Budget from "../components/Budget/Budget";
import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { Navigate } from 'react-router-dom';

const BudgetPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div>
      <NavBar />
      <Budget />
    </div>
  );
};

export default BudgetPage;
