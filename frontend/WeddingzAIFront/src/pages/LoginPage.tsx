import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import { useAuth } from '../hooks/useAuth/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  let { isAuthenticated } = useAuth();
  isAuthenticated = false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ui/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;