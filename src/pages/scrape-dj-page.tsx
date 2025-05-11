import ScrapeDj from "../components/DJ/scrape-dj";
import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { Navigate } from 'react-router-dom';

const ScrapeDjPage: React.FC = () => {

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
      <ScrapeDj />
    </div>
  );
};

export default ScrapeDjPage;
