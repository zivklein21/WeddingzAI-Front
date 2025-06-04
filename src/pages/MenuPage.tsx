import React from 'react';
import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import Menu from '../components/Menu/Menu';
import styles from '../components/Menu/Menu.module.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in Menu:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try refreshing the page.</div>;
    }

    return this.props.children;
  }
}

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
      <NavBar title="Wedding Menu" />
      <div className={styles.container}>
        <div className={styles.section}>
          <h1 className={styles.sectionTitle}>
            <span className={styles.icon}>🍽️</span>
            Wedding Menu Creator
          </h1>
          <ErrorBoundary>
            <Menu />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};

export default MenuPage; 