import React from "react";
import AllVendors from "../components/Vendors/AllVendors";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { NavBar } from "../components/NavBar/NavBar";
import { Navigate } from 'react-router-dom';

const AllVendorsPage: React.FC = () => {

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
      <AllVendors />
    </>
  );
};

export default AllVendorsPage;
