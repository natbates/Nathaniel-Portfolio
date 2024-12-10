import React, { useRef, useContext, useState, useEffect } from "react";
import "../styles/contact.css";
import { AuthContext } from "../comps/authContext";
import fetchData from "../services/fetch-info";
import { doc, updateDoc, collection} from "firebase/firestore"; 
import { db } from "../firebaseConfig";

const Contact = () => {
  const formRef = useRef(null); // Create a reference to the form
  const {currentUser, logout} = useContext(AuthContext);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [x, setX] = useState("");
  const [saving, setSaving] = useState(false);
  const [formspreeKey, setFormspreeKey]= useState(null);

  // Function to clear the form fields
  const handleClear = (event) => {
    event.preventDefault(); // Prevent any default behavior (like page reload)
    formRef.current.reset(); // Reset all fields in the form
  };

  useEffect(() => {
      fetchInfo();
      fetchFormSpreeKey();
  }, []);

  const fetchFormSpreeKey = async () => {
      try {
          const data = await fetchData("keys");
          Object.entries(data.keys).forEach(([key, value]) => {
              if (key === "formspreeKey") {
                  setFormspreeKey(value);
              }
          });
          // Fetch profile picture after fetching other data
      } catch (error) {
          console.error("Error fetching form spree key");
      }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "github") {
        setGithub(value);
    } else if (id === "linkedin") {
        setLinkedin(value);
    } else if (id === "X") {
        setX(value);
    }
  };

  useEffect(() => {fetchInfo()}, []);

  const fetchInfo = async () => {
      try {
          const data = await fetchData("socials");
          Object.entries(data.socials).forEach(([key, value]) => {
              if (key === "github") {
                  setGithub(value);
              } else if (key === "linkedin") {
                  setLinkedin(value);
              } else if (key === "x") {
                  setX(value);
              }
          });
      } catch (error) {
          console.error("Error fetching socials:", error);
      }
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          // Reference to the Firestore document
          const socialsDoc = doc(db, "socials", "socials"); // Replace 'socialLinks' with the document ID

          // Update the document with new values
          await updateDoc(socialsDoc, {
              github,
              linkedin,
              x,
          });

      } catch (error) {
          console.error("Error updating socials:", error);
          alert("Failed to update social links. Please try again.");
      } finally {
          setSaving(false);
      }
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
      {currentUser !== null && (
        <div className="about-info">
            <form className = {`${saving ? "Loading" : ""}`}>
                <label htmlFor="github">Github</label>
                <input
                    type="url" // Ensures the input is a valid URL
                    id="github"
                    name="github"
                    value={github}
                    onChange={handleInputChange}
                    placeholder="Enter Github profile URL"
                    required // Input is required
                />
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                    type="url" // Ensures the input is a valid URL
                    id="linkedin"
                    name="linkedin"
                    value={linkedin}
                    onChange={handleInputChange}
                    placeholder="Enter LinkedIn profile URL"
                    required // Input is required
                />
                <div className = "button-container-right">
                    <div>
                        <label htmlFor="X">X (Formerly Twitter)</label>
                        <input
                            type="url" // Ensures the input is a valid URL
                            id="X"
                            name="X"
                            value={x}
                            onChange={handleInputChange}
                            placeholder="Enter X profile URL"
                            required // Input is required
                        />
                    </div>
                    <button type = "button" onClick={fetchInfo} className="save-button clear" disabled={saving}>
                        Clear
                    </button>
                    <button type = "submit" onClick={handleSave} className="save-button" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
      )}
      <form
        ref={formRef} // Attach the form reference
        action={`https://formspree.io/${formspreeKey}`}
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
          <button disabled = {formspreeKey == null} type="submit" className="submit-button">{formspreeKey == null ? "Loading...": "Send"}</button>
          <button className="submit-button clear" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
