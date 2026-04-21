import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await api.post("/auth/register", formData);
      setMessage(response.data.message || "Registration successful");

      if (onAuthSuccess) {
        await onAuthSuccess();
      } else {
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-copy">
        <span className="eyebrow">Welcome to TaskPro</span>
        <h1>Create a clean workspace account.</h1>
        <p className="auth-copy__text">
          Sign up to manage your tasks in a simple, polished dashboard built for real work.
        </p>
      </div>

      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-badge">Create account</span>
          <h2>Register</h2>
          <p>Enter your details and start using TaskPro.</p>
        </div>

        {message && <div className="notice notice--success">{message}</div>}
        {error && <div className="notice notice--error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="field__label">Name</span>
            <input
              type="text"
              name="name"
              placeholder="Arun"
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
          </label>

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
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </label>

          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
