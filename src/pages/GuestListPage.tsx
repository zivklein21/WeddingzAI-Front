import React from "react";
import GuestList from "../components/GuestList/GuestList";
import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';

const GuestPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <NavBar title=""/>
      <GuestList />
    </>
  );
};

export default GuestPage;
