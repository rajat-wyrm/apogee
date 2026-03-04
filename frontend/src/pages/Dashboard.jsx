import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅ DASHBOARD WORKING!</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        If you can see this, React is rendering correctly.
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "12px 24px",
          background: "white",
          color: "#667eea",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Go to Login
      </button>
    </div>
  );
}
