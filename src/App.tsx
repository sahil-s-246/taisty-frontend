import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import MenuPagenew from "./pages/MenuPagenew";

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={isAuthenticated ? <MenuPage /> : <Navigate to="/login" />}
        />
        <Route path="/res" element={<MenuPagenew />} />
      </Routes>
    </Router>
  );
};

export default App;
