import { Routes, Route, BrowserRouter } from "react-router-dom";

import { AuthProvider } from './hooks/useAuth/AuthContext';

import PrefFormPage from "./pages/PrefFormPage";
import TodoListPage from "./pages/TodoListPage";
import HomePage from "./components/HomePage/HomePage";
import BudgetPage from "./pages/BudgetPage";
import WeddingDashboardPage from "./pages/WeddingDashoardPage";
import AuthPage from "./pages/AuthPage";





export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<PrefFormPage />} />
        <Route path="/todolist" element={<TodoListPage />} />
        <Route path="/budget" element={<BudgetPage/>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/weddash" element={<WeddingDashboardPage/>} /> 
      </Routes>
    </BrowserRouter>
    </AuthProvider>  
  );
}