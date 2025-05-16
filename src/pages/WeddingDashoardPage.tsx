import React from "react";
import WeddingDashboard from "../components/WeddingDashboard/WeddingDash";
import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { Navigate } from 'react-router-dom';

const WeddingDashboardPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div>
      <NavBar title="My Wedding"/>
      <WeddingDashboard />
    </div>
  );
};

export default WeddingDashboardPage;
