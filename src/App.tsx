import { Routes, Route, BrowserRouter } from "react-router-dom";

// import { AuthProvider } from './hooks/useAuth/AuthContext';

import PrefFormPage from "./pages/PrefFormPage";
import TodoListPage from "./pages/TodoListPage";
import HomePage from "./pages/HomePage";
import BudgetPage from "./pages/BudgetPage";
import WeddingDashboardPage from "./pages/WeddingDashoardPage";
import AuthPage from "./pages/AuthPage";
import DetailsMatterPage from "./pages/DetailsMatterPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./hooks/useAuth/AuthContext";
import GuestPage from "./pages/GuestListPage";
import SeatingPage from "./pages/SeatingPage";
import UserVendorsPage from "./pages/UserVEndorsPage";
import AllVendors from "./components/Vendors/AllVendors";
import InvitationPage from "./pages/InvitationPage";
import CalendarPage from "./pages/CalendarPage";
import MenuPage from "./pages/MenuPage";
import { useEffect } from "react";
import faviconSvg from "../src/assets/favicon.svg";


export default function App() {

     useEffect(() => {
    document.title = "WeddingzAI";

    // מציאת / יצירת תגית <link rel="icon">
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    // הגדרת type ל־SVG ו-href לייבוא
    link.type = "image/svg+xml";
    link.href = faviconSvg;
  }, []);

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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/weddash" element={<WeddingDashboardPage />} />
          <Route path="/details-matter" element={<DetailsMatterPage />} />
          <Route path="/guests" element={<GuestPage />} />
          <Route path="/seating" element={<SeatingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/myVendors" element={<UserVendorsPage /> } />
          <Route path="/vendors" element={<AllVendors /> } />
          <Route path="/invitation" element={<InvitationPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
