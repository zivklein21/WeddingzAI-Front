import React from "react";
import TodoList from "../components/TodoList/TodoList";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { NavBar } from "../components/NavBar/NavBar";
import { Navigate } from 'react-router-dom';

const TodoListPage: React.FC = () => {

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
      <TodoList />
    </div>
  );
};

export default TodoListPage;
