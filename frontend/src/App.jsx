import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileLayout from "./components/MobileLayout";

// Mock Page Components (Akan kita isi selanjutnya)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside Mobile Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MobileLayout />}>
            <Route path="/" element={<Dashboard />} />
            {/* Rute /exercises dan /sessions/new akan ditambahkan di sini */}
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
