import React from "react";
import PrefForm from "../components/PrefForm/PrefForm";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { Navigate } from 'react-router-dom';


const PrefFormPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div>
      <PrefForm />
    </div>
  );
};

export default PrefFormPage;
