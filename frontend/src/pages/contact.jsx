import React, { useState } from 'react';
import '../styles/help.css'


function Contact() {

  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://localhost:8080/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (response.ok) {
        setMessage({ type: 'success', text: 'Query submitted successfully!' });
        setForm({ firstName: '', lastName: '', email: '', phone: '', question: '' });
      } else {
        setMessage({ type: 'error', text: 'Submission failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong.' });
    }

    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 4000);    
  };

  return (
    <div className="contactUs-container">
        {message.text && (
          <div className={`popup-message ${message.type}`}>
            {message.text}
          </div>
        )}
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
