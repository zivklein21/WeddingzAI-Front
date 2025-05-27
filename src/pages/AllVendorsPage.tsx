// src/pages/AllVendorsPage.tsx
import React from "react";
import AllVendors from "../components/Vendors/AllVendors";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { NavBar } from "../components/NavBar/NavBar";
import { Navigate } from 'react-router-dom';
import styles from './pages.module.css';

const AllVendorsPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();


  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return <Navigate to="/auth" />;

  return (
    <div className={styles.noScroll}>
      <NavBar title="" />
      <AllVendors />
    </div>
  );
};

export default AllVendorsPage;