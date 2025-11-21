import React, { useState } from "react";
import axiosInstance, { setAuthToken } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST to backend /api/auth/login
      const { data } = await axiosInstance.post("/auth/login", form);

      // Save token in localStorage
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);

      // Navigate to home page
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Forgot password? <a href="/forgot-password">Reset</a>
      </p>
      <p>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
