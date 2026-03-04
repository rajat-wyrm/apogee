import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>
      <nav style={{
        background: "white",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0, color: "#333" }}>📊 Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </nav>
      <div style={{ padding: "20px" }}>
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2>Welcome to Apogee! 🎉</h2>
          <p>Your dashboard is working correctly.</p>
          <p>Now we can add all the premium features.</p>
        </div>
      </div>
    </div>
  );
}
