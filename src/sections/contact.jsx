import React, { useRef } from "react";
import "../styles/contact.css";

const Contact = () => {
  const formRef = useRef(null); // Create a reference to the form

  // Function to clear the form fields
  const handleClear = (event) => {
    event.preventDefault(); // Prevent any default behavior (like page reload)
    formRef.current.reset(); // Reset all fields in the form
  };

  return (
    <div id="contact" className="container">
      <div className="text-container">
        <h1>Contact</h1>
        <p>
          Please feel free to{" "}
          <span className="highlighted">reach out</span> to me using the
          contact form below.
        </p>
      </div>
      <form
        ref={formRef} // Attach the form reference
        action="https://formspree.io/f/YOUR_FORM_ID"
        method="POST"
        className="contact-form"
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Type your name..." required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Type your email..." required />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="5" placeholder="Type your message..." required></textarea>
        </div>
        <div id="contact-button-holder">
          <button type="submit" className="submit-button">Send</button>
          <button className="submit-button clear" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
