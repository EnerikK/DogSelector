import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth";
import { useToast } from "../components/toast";
import "./ShelterAuth.css";

function ShelterLoginPage() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/shelter/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      showToast("Signed in", "success");
      navigate("/shelter/dashboard");
    } catch {
      showToast("Failed to sign in", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Shelter login</h1>
        <p>Manage your dogs, update adoption status, and review listings.</p>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-3 mb-0">
          Need an account? <Link to="/shelter/register">Register your shelter</Link>
        </p>
      </form>
    </div>
  );
}

export default ShelterLoginPage;
