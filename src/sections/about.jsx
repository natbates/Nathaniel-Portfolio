import "../styles/about.css";
import { AuthContext } from "../comps/authContext";
import { useContext, useEffect, useState } from "react";
import fetchData from "../services/fetch-info";
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "../firebaseConfig";

const About = () => {

    const { currentUser, logout } = useContext(AuthContext);

    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [x, setX] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
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
        fetchInfo();
    }, []);

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
    
            alert("Social links updated successfully!");
        } catch (error) {
            console.error("Error updating socials:", error);
            alert("Failed to update social links. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div id="about" className="container">
            <div className="text-container">
                <h1>About</h1>
                <p>
                    I'm currently learning something new every day. My main passion involves computer
                    science and front-end web development, but I also love game design and creating software.
                    My hobbies involve going to the gym 💪, hiking 🥾, and playing the guitar 🎸.
                </p>
            </div>
            {currentUser !== null ? (
                <div className="about-info">
                    <form>
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
                    </form>
                    <button onClick={handleSave} className="save-button" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default About;
