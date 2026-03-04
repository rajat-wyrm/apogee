import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px"
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
              style: { background: "#065f46" }
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
              style: { background: "#7f1d1d" }
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App;
