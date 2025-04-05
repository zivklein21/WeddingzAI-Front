import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth/AuthContext';
import PrefFormPage from "./pages/PrefFormPage";
import TodoListPage from "./pages/TodoListPage";
import HomePage from "./components/HomePage/HomePage";
import AuthSlider from "./components/AuthPage/AuthPage";

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthSlider/>}/>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<PrefFormPage />} />
        <Route path="/todolist" element={<TodoListPage />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
