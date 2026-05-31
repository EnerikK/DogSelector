import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth";
import { useToast } from "../components/toast";
import "./ShelterAuth.css";

function ShelterRegisterPage() {
  const navigate = useNavigate();
  const { register, user, loading } = useAuth();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    shelter_name: "",
    country: "",
    city: "",
    postcode: "",
    website: "",
    phone: "",
  });

  if (!loading && user) {
    return <Navigate to="/shelter/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
        shelter_name: form.shelter_name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        postcode: form.postcode.trim(),
        website: form.website.trim(),
        phone: form.phone.trim(),
      });
      showToast("Shelter account created", "success");
      navigate("/shelter/dashboard");
    } catch {
      showToast("Failed to register shelter", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Register shelter</h1>
        <p>Create a shelter account to publish and manage adoption listings.</p>

        <div className="mb-3">
          <label className="form-label">Shelter name</label>
          <input className="form-control" name="shelter_name" value={form.shelter_name} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Country</label>
            <input className="form-control" name="country" value={form.country} onChange={handleChange} required />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">City</label>
            <input className="form-control" name="city" value={form.city} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Postcode</label>
            <input className="form-control" name="postcode" value={form.postcode} onChange={handleChange} />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Website</label>
          <input className="form-control" name="website" value={form.website} onChange={handleChange} />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create shelter account"}
        </button>

        <p className="mt-3 mb-0">
          Already registered? <Link to="/shelter/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default ShelterRegisterPage;
