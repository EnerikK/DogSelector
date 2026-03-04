import { useState } from "react";
import { useContact } from "../hooks/useContact";
import { useToast } from "../components/ToastContext";
import "./ContactPage.css";

function ContactPage() {
  const { sendContact } = useContact();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    name: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendContact(form);

      showToast("Message sent successfully", "success");

      setForm({
        email: "",
        name: "",
        message: ""
      });

    } catch {
      showToast("Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 contact-left">
            <h1 className="contact-title">
              Contact Dog Selector today
            </h1>
            <p className="contact-subtitle">
              Discover how Dog Selector can help you save time and bring joy.
            </p>
            <div className="dog-card">
              <img
                src="/dogImage.jpg"
                alt="Dog"
                className="dog-avatar"
              />
              <div>
                <p className="dog-title">
                  Hi, I am Woof, your dog selector specialist.
                </p>
                <p className="dog-text">
                  Please tell us more about your needs so that we can find the
                  right fit for you.
                </p>
              </div>
            </div>
            <div className="review-row">
              <span className="review">
                ✈️ Capterra <strong>4.9</strong>
              </span>
              <span className="review">
                💬 Software advice <strong>4.9</strong>
              </span>
            </div>
          </div>
          <div className="col-lg-4 offset-lg-1">
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
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
                <div className="mb-4">
                  <label>Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="form-control"
                    placeholder="Type here"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  className="btn btn-primary submit-btn"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;