import "../styles/hackathons.css";
import Hackathon from "../comps/hackathon";
import { AuthContext } from "../comps/authContext";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../comps/App";
import fetchData from "../services/fetch-info";
import { addDoc, doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { handleUpload } from "../services/upload-image.js";
import { LoadingSection } from "../comps/loading.jsx";

const Hackathons = () =>
{

    const {currentUser, logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const {theme} = useContext(ThemeContext);
    const [hackathons, setHackathons] = useState([]);
    const [fetching, setFetching] = useState(false);

    const [title, setTitle] = useState("");
    const [info, setInfo] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [photo, setPhoto] = useState(null);
    const [sources, setSources] = useState([]);  // Track sources as an array of objects

    useEffect(() => {
        const fetchInfo = async () => {
            setFetching(true);
            try {
                const hackathons = await fetchData("hackathons");
                console.log("here ", hackathons);
                setHackathons(hackathons);
            } catch (error) {
                console.error("Error fetching hackathons:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchInfo();
    }, []);

    const clearForm = () => {
        setTitle("");
        setInfo("");
        setPhoto(null);
        setDate("");
        setSources([]);  // Clear sources state
        document.getElementById("hackathon-source-url").value = "";
    };

    function formatDateToMonthYear(dateString) {
        const date = new Date(dateString);
        
        // Options to specify how we want the date formatted
        const options = { year: 'numeric', month: 'long' };
        
        // Return the formatted date
        return date.toLocaleString('en-US', options);
      }

    const DeleteHackathon = async(hackathonID, hackathonTitle) =>
        {
            setLoading(true);
            try {
                console.log("ID", hackathonID);
                // Find the experience that matches the title, role, and info
                const hackathonToDelete = hackathons[hackathonID];
                console.log("deleting: ", hackathonToDelete);
                if (
                    hackathonToDelete.title === hackathonTitle
                ) {
                    // Proceed to delete this experience from Firestore
                    const hackathonDocRef = doc(db, "hackathons", hackathonID);
                    await deleteDoc(hackathonDocRef);
                    console.log(`Hackathon with ID ${hackathonID} deleted.`);
                    
                    // Remove the experience from local state
                    setHackathons((prevHackathons) => {
                        const updatedHackathons = { ...prevHackathons };
                        delete updatedHackathons[hackathonID];
                        return updatedHackathons;
                    });
                } else {
                    console.log("Hackathon details do not match.");
                }
            } catch (error) {
                console.error("Error deleting hackathon:", error);
            }
            setLoading(false);
        };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (!photo) {
            alert("No photo selected!");
            setLoading(false);
            return;
        }
        
        let imageUrl = "";

        try {
            imageUrl = await handleUpload(photo);
        } catch (error) {
            console.log(error);
        }

        try {
            // Step 2: Create a new project object
            const newHackathon = {
                title,
                info,
                photo: imageUrl,
                date: formatDateToMonthYear(date),
                location,
                sources
            };
            console.log("adding ", newHackathon);
            
            // Step 3: Add the new project to Firestore
            const docRef = await addDoc(collection(db, "hackathons"), newHackathon);
            console.log("Document written with ID:", docRef.id);

            // Step 4: Update the local state to include the new project
            setHackathons((prevHackathons) => ({
                ...prevHackathons,
                [docRef.id]: { id: docRef.id, ...newHackathon },
            }));

            // Reset the form after submission
            clearForm();
        } catch (error) {
            console.error("Error submitting hackthon:", error);
            setLoading(false);
        }
        setLoading(false);
    };

    const getIconForSource = (type) => {
        const iconColor = theme === "light" ? "black" : "white"; // Icon color based on the theme
        
        switch (type.trim()) {
            
            case "Youtube":
                return <img className = "source-logo" src={`svgs/icons/youtube-${iconColor}.svg`} alt="YouTube" />;
            case "Github":
                return <img className = "source-logo" src={`svgs/icons/github-${iconColor}.svg`} alt="GitHub" />;
            case "Devpost":
                return <img className = "source-logo" src={`svgs/icons/devpost-${iconColor}.svg`} alt="Devpost" />;
            case "Website":
                return <img className = "source-logo" src={`svgs/icons/website-${iconColor}.svg`} alt="Website" />;
            default:
                console.log(type, "NOT HUTTT");
                return null;
        }
    };

    const handleDelete = (index) => {
        const newSources = [...sources]; // Copy the current array
        newSources.splice(index, 1); // Remove the source at the given index
        setSources(newSources); // Update the state
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === "title") setTitle(value);
        if (id === "info") setInfo(value);
        if (id === "photo") setPhoto(event.target.files[0]); 
        if (id === "date") setDate(value);
        if (id === "location") setLocation(value);
    };

    // Handle adding a new source
    const addNewSource = (e) => {
        e.preventDefault();
        const sourceType = document.getElementById("hackathon-dropdown-source").value;
        const sourceURL = document.getElementById("hackathon-source-url").value;

        if (sourceURL && sourceType) {
            const newSource = { type: sourceType, url: sourceURL };
            setSources((prevSources) => [...prevSources, newSource]);
            document.getElementById("source-url").value = '';  // Clear the input field
        } else {
            alert("Please select a source type and provide a URL.");
        }
    };

    return(
        <div id = "hackathons" className = "container">
            <div className = "text-container">
                <h1>Hackathons</h1>
                <p>These are all the Hackathons I have attended. I have learnt so much and met so many interesting people throughout these events! And it even landedd me my first job!</p>

                <div id="hackathon-container">
                {fetching && <LoadingSection />}
                {!hackathons || Object.keys(hackathons).length === 0 && !fetching && <p>No Hackathons.</p>}
                
                {hackathons!= null && Object.entries(hackathons)
                        .sort(([, a], [, b]) => new Date(a.date) - new Date(b.date)) // Sort hackathons by date
                        .map(([key, hackathon]) => (
                            <div className="hackathon" key={key}>
                                <Hackathon
                                    title={hackathon.title}
                                    info={hackathon.info}
                                    date={hackathon.date}
                                    photo={hackathon.photo}
                                    location={hackathon.location}
                                    sources={hackathon.sources}
                                />
                                {currentUser && (
                                    <img
                                        onClick={() => DeleteHackathon(key, hackathon.title)}
                                        className="trash topright"
                                        src="svgs/trash-white.svg"
                                        alt="Delete"
                                />
                            )}
                        </div>
                    )
                )}
            </div>

            {currentUser != null && (
                <div className="add-experience">
                    <form className={`add-experience-form ${loading ? "Loading" : ""}`} onSubmit={handleSubmit}>
                        <label htmlFor="title">Hackathon Name*</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Type experience title..."
                            value={title}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="location">Location*</label>
                        <input
                            id="location"
                            type="search"
                            placeholder="Enter your location"
                            value={location}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="date">Date*</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="info">Info</label>
                        <textarea
                            id="info"
                            type="text"
                            rows="5"
                            placeholder="Type experience information..."
                            value={info}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="hackathon-dropdown-source">Sources</label>
                        <div className="drop-down-options">
                            <select id="hackathon-dropdown-source">
                                <option value="Website">Website</option>
                                <option value="Github">Github</option>
                                <option value="Youtube">Youtube</option>
                                <option value="Devpost">Devpost</option>
                            </select>
                            <input
                                id="hackathon-source-url"
                                type="url"
                                placeholder="Type link for source..."
                            />
                            <button type="button" onClick={addNewSource} disabled={loading}>Add</button>
                        </div>

                        <div id="source-holder">
                            {sources.length > 0 ? (
                                sources.map((source, index) => (
                                    <span key = {index}>{getIconForSource(source.type)}<p key={index}>{source.type}: {source.url}</p><img onClick={() => handleDelete(index)} src = {theme === "light" ? "svgs/trash-black.svg" : "svgs/trash-white.svg"}></img></span>
                                ))
                            ) : (
                                <p>No sources added yet.</p>
                            )}
                        </div>
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
                </div>)}
            </div>
        </div>
    );
}

export default Hackathons;