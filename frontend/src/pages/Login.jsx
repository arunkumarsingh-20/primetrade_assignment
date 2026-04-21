import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/auth/login", formData);
      setMessage(response.data.message || "Login successful");

      if (onAuthSuccess) {
        await onAuthSuccess();
      } else {
        setTimeout(() => navigate("/dashboard"), 700);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell auth-shell--reverse">
      <div className="auth-copy">
        <span className="eyebrow">TaskPro access</span>
        <h1>Sign in to your workspace.</h1>
        <p className="auth-copy__text">
          Login and continue managing your tasks in a clean, modern dashboard.
        </p>
      </div>

      <div className="auth-card auth-card--compact">
        <div className="auth-card__header">
          <span className="auth-badge">Secure login</span>
          <h2>Login</h2>
          <p>Enter your account details to continue.</p>
        </div>

        {message && <div className="notice notice--success">{message}</div>}
        {error && <div className="notice notice--error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="field__label">Email</span>
            <input
              type="email"
              name="email"
              placeholder="arun@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </label>

          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
