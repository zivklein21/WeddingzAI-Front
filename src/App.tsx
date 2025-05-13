import { Routes, Route, BrowserRouter } from "react-router-dom";

// import { AuthProvider } from './hooks/useAuth/AuthContext';

import PrefFormPage from "./pages/PrefFormPage";
import TodoListPage from "./pages/TodoListPage";
import HomePage from "./pages/HomePage";
import BudgetPage from "./pages/BudgetPage/BudgetPage";
import WeddingDashboardPage from "./pages/WeddingDashoardPage";
import AuthPage from "./pages/AuthPage";
import DetailsMatterPage from "./pages/DetailsMatterPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./hooks/useAuth/AuthContext";
import DJPage from "./pages/DJPage";
import ScrapeDjPage from "./pages/scrape-dj-page";
import GuestPage from "./pages/GuestListPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/plan" element={<PrefFormPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/todolist" element={<TodoListPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/djs" element={<DJPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/weddash" element={<WeddingDashboardPage />} />
          <Route path="/vendor" element={<ScrapeDjPage />} />
          <Route path="/details-matter" element={<DetailsMatterPage />} />
          <Route path="/guests" element={<GuestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
