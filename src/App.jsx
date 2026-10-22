import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import "./index.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Posts from "./pages/Posts";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
             path="/posts"
            element={<ProtectedRoute> <Posts /> </ProtectedRoute>}
            />

          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;