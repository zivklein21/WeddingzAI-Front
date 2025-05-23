import { NavBar } from "../components/NavBar/NavBar";
import { useAuth } from "../hooks/useAuth/AuthContext";
import { Navigate } from 'react-router-dom';
import Profile from "../components/ProfileForm/ProfileForm";

const ProfilePage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <NavBar title="My Wedding"/>
      <Profile />
    </>
  );
};

export default ProfilePage;
