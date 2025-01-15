import "../styles/experience.css";
import Experience from "../comps/experience";
import { AuthContext } from "../comps/authContext";
import { useContext, useState, useEffect } from "react";
import fetchData from "../services/fetch-info";
import { db } from "../firebaseConfig";
import { addDoc, collection, doc, deleteDoc } from "firebase/firestore";
import { handleUpload } from "../services/upload-image";
import { ThemeContext } from "../comps/App";
import { LoadingSection } from "../comps/loading";

const Experiences = () => {

    const {currentUser, logout }= useContext(AuthContext);
    const [experiences, setExperiences] = useState();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const {theme} = useContext(ThemeContext);
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
            setFetching(true);
            try {
                const exp = await fetchData("experiences");
                setExperiences(exp);
                
            } catch (error) {
                console.error("Error fetching socials:", error);
            } finally
            {
                setFetching(false);
            }
        };
        fetchInfo();
    }, []);

    function formatDateToMonthYear(dateString) {
        const date = new Date(dateString);
        
        // Options to specify how we want the date formatted
        const options = { year: 'numeric', month: 'long' };
        
        // Return the formatted date
        return date.toLocaleString('en-US', options);
      }
      

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (!photo) {
            alert("No photo selected!");
            setLoading(false);
            return;
        }

        if (startDate > endDate)
        {
            alert("Start date has to be before end date!")
            setEndDate("");
            setLoading(false);
            return;
        }
        
        let imageUrl = "";

        try {
            imageUrl = await handleUpload(photo);
        } catch (error)
        {
            console.log(error);
        }
        try {
    
            // Step 2: Create a new experience object
            const newExperience = {
                title,
                role,
                date: `${formatDateToMonthYear(startDate)} - ${formatDateToMonthYear(endDate)}`,
                info,
                image: imageUrl
            };
    
            // Step 3: Add the new experience to Firestore
            const docRef = await addDoc(collection(db, "experiences"), newExperience);
    
            // Step 4: Update the local state to include the new experience
            setExperiences((prevExperiences) => ({
                ...prevExperiences,
                [docRef.id]: { id: docRef.id, ...newExperience },
            }));
    
            // Reset the form after submission
            clearForm();
        } catch (error) {
            console.error("Error submitting experience:", error);
        }
        setLoading(false);
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
        setLoading(true);
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
                
                // Remove the experience from local state
                setExperiences((prevExperiences) => {
                    const updatedExperiences = { ...prevExperiences };
                    delete updatedExperiences[expId];
                    return updatedExperiences;
                });
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
        setLoading(false);
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

            {fetching && <LoadingSection/>}

            {experiences && Object.keys(experiences).length === 0 && !fetching && <p>No Experiences Listed.</p>}

            {experiences != null && Object.entries(experiences)
                .sort(([keyA, expA], [keyB, expB]) => {
                    // Extract and parse start date from the `date` field
                    const startDateA = expA.date ? new Date(expA.date.split(' - ')[0]) : new Date();
                    const startDateB = expB.date ? new Date(expB.date.split(' - ')[0]) : new Date();

                    // Sort experiences by the parsed start date
                    return startDateA - startDateB;
                })
                .map(([key, exp], index, arr) => {
                    // Calculate animation delay
                    
                    return (
                        <div 
                            className="experience-holder" 
                            key={key} 
                        >
                            <Experience
                                title={exp.title || "No Title Available"}
                                date={exp.date || "No Date Given"}
                                role={exp.role || "No Role Provided"}
                                info={exp.info || "No Information Provided"}
                                image={exp.image || null}
                            />
                            {currentUser && 
                                <img
                                    onClick={() => handleDelete(key, exp.title, exp.role, exp.info)}
                                    className="trash"
                                    src="svgs/trash-white.svg"
                                    alt="Delete"
                                />
                            }
                        </div>
                    );
                })}
            </div>

            

            {currentUser != null && (
                <div className="add-experience">
                    <form className={`add-experience-form ${loading ? "Loading" : ""}`} onSubmit={handleSubmit}>
                        <label htmlFor="title">Title*</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Type experience title..."
                            value={title}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="role">Role*</label>
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
                                />
                            </span>
                            <span>
                                <label htmlFor="end-date">End Date</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={handleInputChange}
                                />
                            </span>
                        </div>
                        <label htmlFor="info">Info</label>
                        <textarea
                            id="info"
                            type="text"
                            rows="5"
                            placeholder="Type experience information..."
                            value={info}
                            onChange={handleInputChange}
                        />
                        <div className="button-container-right">
                            <div>
                                <label htmlFor="photo">Photo*</label>
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
                            <button disabled = {loading} type="submit">{!loading ? "Add" : "Loading..."}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Experiences;
