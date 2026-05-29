import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContact } from "../hooks/useContact";
import { useToast } from "../components/toast";
import type { ContactSubmission, PreferredContactMethod } from "../types/contact";
import "./ContactPage.css";

type ApplicationForm = Required<Omit<ContactSubmission, "dog">> & {
  dog: number | null;
};

const getDogId = (value: string | null) => {
  if (!value) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

function ContactPage() {
  const { sendContact } = useContact();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const dogId = getDogId(searchParams.get("dog"));
  const dogName = searchParams.get("name");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState<ApplicationForm>({
    dog: dogId,
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
      [e.target.name]:
        e.target.name === "preferred_contact_method"
          ? (e.target.value as PreferredContactMethod)
          : e.target.value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      (form.preferred_contact_method === "phone" ||
        form.preferred_contact_method === "whatsapp") &&
      !form.phone.trim()
    ) {
      setFormError("Add a phone number for phone or WhatsApp contact.");
      return;
    }

    try {
      setLoading(true);
      setFormError(null);
      await sendContact({
        ...form,
        dog: form.dog || undefined,
        email: form.email.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        message: form.message.trim(),
        household: form.household.trim(),
        dog_experience: form.dog_experience.trim(),
      });
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
                <form onSubmit={handleSubmit} noValidate={false}>
                  {dogName && (
                    <div className="application-target">
                      Application for <strong>{dogName}</strong>
                    </div>
                  )}
                  {formError && (
                    <div className="alert alert-danger py-2" role="alert">
                      {formError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="application-email">Email</label>
                    <input
                      id="application-email"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Type here"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="application-name">Name</label>
                    <input
                      id="application-name"
                      name="name"
                      className="form-control"
                      placeholder="Type here"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="application-phone">Phone</label>
                    <input
                      id="application-phone"
                      name="phone"
                      type="tel"
                      className="form-control"
                      placeholder="Type here"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="application-country">Country</label>
                      <input
                        id="application-country"
                        name="country"
                        className="form-control"
                        placeholder="Greece"
                        value={form.country}
                        onChange={handleChange}
                        autoComplete="country-name"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="application-city">City</label>
                      <input
                        id="application-city"
                        name="city"
                        className="form-control"
                        placeholder="Athens"
                        value={form.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="application-contact-method">Preferred contact</label>
                    <select
                      id="application-contact-method"
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
                    <label htmlFor="application-household">Household</label>
                    <textarea
                      id="application-household"
                      name="household"
                      rows={3}
                      className="form-control"
                      placeholder="Home, garden, children, other pets"
                      value={form.household}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="application-experience">Dog experience</label>
                    <textarea
                      id="application-experience"
                      name="dog_experience"
                      rows={3}
                      className="form-control"
                      placeholder="Previous dogs, rescue experience, training experience"
                      value={form.dog_experience}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="application-message">Message</label>
                    <textarea
                      id="application-message"
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
                    type="submit"
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