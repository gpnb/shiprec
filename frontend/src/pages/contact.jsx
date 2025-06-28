import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/help.css'


function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    question: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with API call or email logic
    console.log('Form submitted:', form);
  };

  return (
    <div className="contactUs-container">
        <div className="contactUs-card">
          <div className="contact-container">
            <div className="contact-left">
              <h2>Contact Us</h2>
              <h3><em>How can we help you?</em></h3>
              <p>Submit any questions you have about the app and the admins will get back to you.</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <div className="form-row full-width">
                <textarea
                  name="question"
                  placeholder="What’s your question?"
                  value={form.question}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button">Submit</button>
            </form>
          </div>
      </div>
    </div>
  );
};


export default Contact;
