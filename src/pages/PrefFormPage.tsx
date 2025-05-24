import React, { useEffect, useState } from "react";
import PrefForm from "../components/PrefForm/PrefForm";
import tdlService from "../services/tdl-service";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { Navigate } from 'react-router-dom';


const PrefFormPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();
  const [hasTdl, setHasTdl] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTdl = async () => {
      try {
        await tdlService.fetchMyTdl();
        setHasTdl(true);
      } catch {
        setHasTdl(false);
      }
    };
    checkTdl();
  }, []);

  if (loading || hasTdl === null) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (hasTdl) {
    return <Navigate to="/weddash" />;
  }

  return (
    <>
      <PrefForm />
    </>
  );
};

export default PrefFormPage;
