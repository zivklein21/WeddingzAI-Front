import React from "react";
import Vendor from "../components/Vendors/Vendors";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { NavBar } from "../components/NavBar/NavBar";
import { Navigate } from 'react-router-dom';

const UserVendorsPage: React.FC = () => {

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
      <Vendor />
    </>
  );
};

export default UserVendorsPage;
