import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const BackEndURL = process.env.REACT_APP_BACKEND_URL;

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // new optional email field
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, password };
      if (email.trim()) {
        payload.email = email;
      }

      const response = await axios.post(`${BackEndURL}/api/signup`, payload);
      alert(response.data.message);
      navigate("/login"); // Redirect to login after signup
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Email (optional):</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn" type="submit">Signup</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="toggle" onClick={() => navigate("/login")}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;
