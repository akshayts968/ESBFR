import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const BackEndURL = process.env.REACT_APP_BACKEND_URL;
console.log("Backend URL:", BackEndURL);

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔍 Check if user is already logged in
  /*useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home"); // Redirect to home if logged in
    }
  }, [navigate]);*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(username, password);
      console.log("Backend URL:", BackEndURL);
      const response = await axios.post(`${BackEndURL}/api/login`, { username, password });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      alert(response.data.message);

      // Redirect to home after login
      navigate("/home");
    } catch (err) {
      console.error("Axios error:", err.response);
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="toggle" onClick={() => navigate("/signup")}>
        Don't have an account? Sign up
      </p>
    </div>
  );
}

export default Login;
