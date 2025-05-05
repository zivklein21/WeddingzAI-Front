import { Routes, Route, BrowserRouter } from "react-router-dom";

// import { AuthProvider } from './hooks/useAuth/AuthContext';

import PrefFormPage from "./pages/PrefFormPage";
import TodoListPage from "./pages/TodoListPage";
import HomePage from "./pages/HomePage";
import BudgetPage from "./pages/BudgetPage";
import WeddingDashboardPage from "./pages/WeddingDashoardPage";
import AuthPage from "./pages/AuthPage";
import VendorsSearchPage from "./pages/SearchVendorsPage";





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/plan" element={<PrefFormPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/todolist" element={<TodoListPage />} />
        <Route path="/budget" element={<BudgetPage/>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/weddash" element={<WeddingDashboardPage/>} /> 
        <Route path="/vendor" element={<VendorsSearchPage/>} /> 
      </Routes>
    </BrowserRouter>
  );
}