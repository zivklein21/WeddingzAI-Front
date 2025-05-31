import React from 'react';
import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import Menu from '../components/Menu/Menu';

const MenuPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <NavBar title="" />
      <Menu />

    </>
  );
};

export default MenuPage; 