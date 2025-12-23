import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance, { setAuthToken } from "../utils/axiosInstance";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || "");
      setAuthToken(data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Continue</button>
        </form>
        <p>
          Forgot password? <Link to="/forgot-password">Reset</Link>
        </p>
        <p>
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
