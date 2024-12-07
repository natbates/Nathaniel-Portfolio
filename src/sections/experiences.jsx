import "../styles/experience.css";
import Experience from "../comps/experience";
import { AuthContext } from "../comps/authContext";
import { useContext, useState, useEffect } from "react";
import fetchData from "../services/fetch-info";
import { db } from "../firebaseConfig";
import { addDoc, collection, doc, deleteDoc } from "firebase/firestore";

const Experiences = () => {
    const currentUser = useContext(AuthContext);
    const [experiences, setExperiences] = useState();

    const [title, setTitle] = useState("");
    const [role, setRole] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [info, setInfo] = useState("");
    const [photo, setPhoto] = useState(null);

    // Handle input changes
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === "title") setTitle(value);
        if (id === "role") setRole(value);
        if (id === "start-date") setStartDate(value);
        if (id === "end-date") setEndDate(value);
        if (id === "info") setInfo(value);
        if (id === "photo") setPhoto(event.target.files[0]); // Handling file input
    };

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const exp = await fetchData("experiences");
                console.log("here ", exp);
                setExperiences(exp);
                
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };
        fetchInfo();
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Create a new experience object
        const newExperience = {
            title,
            role,
            date: `${startDate} to ${endDate}`, // Corrected
            info,
            img: "photo url", // Replace with actual photo URL once uploaded
        };
    
        try {
            // Add the new experience to Firestore
            const docRef = await addDoc(collection(db, "experiences"), newExperience);
            console.log("Document written with ID: ", docRef.id);
    
            // Update the local state to include the new experience
            setExperiences((prevExperiences) => ({
                ...prevExperiences, // Spread the previous experiences
                [docRef.id]: { id: docRef.id, ...newExperience }, // Add the new experience with the document ID
            }));
    
            // Reset the form after submission
            clearForm();
        } catch (error) {
            console.error("Error adding experience:", error);
        }
    };
    
    // Handle clear button
    const clearForm = () => {
        setTitle("");
        setRole("");
        setStartDate("");
        setEndDate("");
        setInfo("");
        setPhoto(null);
    };


    const handleDelete = async (expId, title, role, info) => {
        try {
            // Find the experience that matches the title, role, and info
            const expToDelete = experiences[expId];
            
            if (
                expToDelete.title === title &&
                expToDelete.role === role &&
                expToDelete.info === info
            ) {
                // Proceed to delete this experience from Firestore
                const expDocRef = doc(db, "experiences", expId);
                await deleteDoc(expDocRef);
                console.log(`Experience with ID ${expId} deleted.`);
                
                // Remove the experience from local state
                setExperiences((prevExperiences) => {
                    const updatedExperiences = { ...prevExperiences };
                    delete updatedExperiences[expId];
                    return updatedExperiences;
                });
            } else {
                console.log("Experience details do not match.");
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    return (
        <div id="experiences" className="container">
            <div className="text-container">
                <h1>Experience</h1>
                <p>
                    I have gained plenty of valuable experience during my time as a <span className="highlighted">Developer</span>, these are the main experiences which have helped shape my career.
                </p>
            </div>

            <div className="experience-container">
            {experiences && Object.entries(experiences).map(([key, exp]) => (
                <div className="experience-holder">
                    <Experience
                        key={key}
                        title={exp.title || "No Title Available"} 
                        date={exp.date || "No Date Given"}
                        role={exp.role || "No Role Provided"} 
                        info={exp.info || "No Information Provided"}
                        img={exp.img || null} 
                    />
                    {currentUser && 
                        <img
                            onClick={() => handleDelete(key, exp.title, exp.role, exp.info)}
                            className="trash"
                            src="svgs/trash.svg"
                            alt="Delete"
                        />
                    }
                </div>
                ))}
            </div>

            {currentUser !== null ? (
                <div className="add-experience">
                    <form className="add-experience-form" onSubmit={handleSubmit}>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Type experience title..."
                            value={title}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="role">Role</label>
                        <input
                            id="role"
                            type="text"
                            placeholder="Type role..."
                            value={role}
                            onChange={handleInputChange}
                            required
                        />
                        <div id = "date-container">
                            <span>
                                <label htmlFor="start-date">Start Date</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </span>
                            <span>
                                <label htmlFor="end-date">End Date</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </span>
                        </div>
                        <label htmlFor="info">Info</label>
                        <input
                            id="info"
                            type="text"
                            placeholder="Type experience information..."
                            value={info}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="button-container-right">
                            <div>
                                <label htmlFor="photo">Photo</label>
                                <input
                                    id="photo"
                                    type="file"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                className="clear"
                                onClick={clearForm} // Clear the form on click
                            >
                                Clear
                            </button>
                            <button type="submit">Add</button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default Experiences;
