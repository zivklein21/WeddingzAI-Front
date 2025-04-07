import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth/AuthContext';
import PrefFormPage from "./pages/PrefFormPage";
import TodoListPage from "./pages/TodoListPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import BudgetPage from "./pages/BudgetPage";


export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<PrefFormPage />} />
        <Route path="/todolist" element={<TodoListPage />} />
        <Route path="/budget" element={<BudgetPage/>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
