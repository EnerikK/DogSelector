import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContact } from "../hooks/useContact";
import { useToast } from "../components/toast";
import type { ContactSubmission, PreferredContactMethod } from "../types/contact";
import "./ContactPage.css";

function ContactPage() {
  const { sendContact } = useContact();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const dogId = searchParams.get("dog");
  const dogName = searchParams.get("name");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ContactSubmission>({
    dog: dogId ? Number(dogId) : null,
    email: "",
    name: "",
    phone: "",
    country: "",
    city: "",
    message: "",
    household: "",
    dog_experience: "",
    preferred_contact_method: "email",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "preferred_contact_method"
        ? (e.target.value as PreferredContactMethod)
        : e.target.value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await sendContact(form);
      showToast("Application sent successfully", "success");
      setSent(true);
    } catch {
      showToast("Failed to send application", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="application-shell">
        <div className="application-header">
          <div>
            <h1 className="contact-title">
              Start an adoption application
            </h1>
            <p className="contact-subtitle">
              Share the details a rescue team needs before they contact you.
            </p>
          </div>
          <span className="application-step">New application</span>
        </div>

        <div className="application-layout">
          <aside className="application-summary">
            <div className="dog-card">
              <img
                src="/dogImage.jpg"
                alt="Dog"
                className="dog-avatar"
              />
              <div>
                <p className="dog-title">
                  {dogName ? `Applying for ${dogName}` : "Looking for the right rescue dog?"}
                </p>
                <p className="dog-text">
                  Your application is stored for the rescue team so they can review fit, location, and next steps.
                </p>
              </div>
            </div>
            <div className="summary-list">
              <div>
                <span>Review focus</span>
                <strong>Fit, location, experience</strong>
              </div>
              <div>
                <span>Next step</span>
                <strong>Rescue team follow-up</strong>
              </div>
              <div>
                <span>Saved in</span>
                <strong>Django Admin applications</strong>
              </div>
            </div>
          </aside>

          <main>
            <div className="contact-form">
              {sent ? (
                <div className="contact-success">
                  <h5>Application received.</h5>
                  <p>The rescue team can now review your application.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {dogName && (
                    <div className="application-target">
                      Application for <strong>{dogName}</strong>
                    </div>
                  )}
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Type here"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      name="name"
                      className="form-control"
                      placeholder="Type here"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Phone</label>
                    <input
                      name="phone"
                      className="form-control"
                      placeholder="Type here"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Country</label>
                      <input
                        name="country"
                        className="form-control"
                        placeholder="Greece"
                        value={form.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>City</label>
                      <input
                        name="city"
                        className="form-control"
                        placeholder="Berlin"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Preferred contact</label>
                    <select
                      name="preferred_contact_method"
                      className="form-select"
                      value={form.preferred_contact_method}
                      onChange={handleChange}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Household</label>
                    <textarea
                      name="household"
                      rows={3}
                      className="form-control"
                      placeholder="Home, garden, children, other pets"
                      value={form.household}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Dog experience</label>
                    <textarea
                      name="dog_experience"
                      rows={3}
                      className="form-control"
                      placeholder="Previous dogs, rescue experience, training experience"
                      value={form.dog_experience}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label>Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      className="form-control"
                      placeholder="Why do you think this dog is a good fit?"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    className="btn btn-primary submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Apply"}
                  </button>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;