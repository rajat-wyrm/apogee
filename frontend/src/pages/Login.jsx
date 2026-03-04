import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ThreeDBackground from "../components/effects/ThreeDBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      toast.success("Login successful! 🎉");
      navigate("/dashboard");
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <>
      <ThreeDBackground />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <h1 style={{ 
            textAlign: "center", 
            marginBottom: "30px", 
            color: "white",
            fontSize: "2.5rem"
          }}>
            🚀 Apogee
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "5px",
                  fontSize: "16px",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  outline: "none"
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "5px",
                  fontSize: "16px",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  outline: "none"
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background 0.3s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#6366f1"}
              onMouseLeave={(e) => e.target.style.background = "#4f46e5"}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
