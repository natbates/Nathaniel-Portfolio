import "../styles/projects.css";
import Project from "../comps/project.jsx";
import Loading from "../comps/loading.jsx";
import { AuthContext } from "../comps/authContext.jsx";
import react, { useState, useContext, useEffect } from "react";
import fetchData from "../services/fetch-info.js";
import { addDoc, doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { handleUpload } from "../services/upload-image.js";
import { ThemeContext } from "../comps/App.jsx";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const { currentUser, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const {theme} = useContext(ThemeContext);
    const [projectName, setProjectName] = useState("");
    const [info, setInfo] = useState("");
    const [skills, setSkills] = useState("");
    const [photo, setPhoto] = useState(null);
    const [sources, setSources] = useState([]);  // Track sources as an array of objects

    // Handle input changes
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === "project-name") setProjectName(value);
        if (id === "info") setInfo(value);
        if (id === "photo") setPhoto(event.target.files[0]); 
        if (id === "skills") setSkills(value);
    };

    // Handle adding a new source
    const addNewSource = (e) => {
        e.preventDefault();
        const sourceType = document.getElementById("dropdown-source").value;
        const sourceURL = document.getElementById("source-url").value;

        if (sourceURL && sourceType) {
            const newSource = { type: sourceType, url: sourceURL };
            setSources((prevSources) => [...prevSources, newSource]);
            document.getElementById("source-url").value = '';  // Clear the input field
        } else {
            alert("Please select a source type and provide a URL.");
        }
    };

    // Fetch projects on mount
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const projects = await fetchData("projects");
                console.log("here ", projects);
                setProjects(projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchInfo();
    }, []);

    // Handle form submission
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
            const newProject = {
                projectName,
                info,
                photo: imageUrl,
                skills,
                sources
            };
            console.log("adding ", newProject);
            
            // Step 3: Add the new project to Firestore
            const docRef = await addDoc(collection(db, "projects"), newProject);
            console.log("Document written with ID:", docRef.id);

            // Step 4: Update the local state to include the new project
            setProjects((prevProjects) => ({
                ...prevProjects,
                [docRef.id]: { id: docRef.id, ...newProject },
            }));

            // Reset the form after submission
            clearForm();
        } catch (error) {
            console.error("Error submitting project:", error);
            setLoading(false);
        }
        setLoading(false);
    };

    const handleDelete = (index) => {
        const newSources = [...sources]; // Copy the current array
        newSources.splice(index, 1); // Remove the source at the given index
        setSources(newSources); // Update the state
    };

    // Handle clear button
    const clearForm = () => {
        setProjectName("");
        setInfo("");
        setPhoto(null);
        setSkills("");
        setSources([]);  // Clear sources state
    };

    return (
        <div id="projects" className="container">
            <div className="text-container">
                <h1>Projects</h1>
                <p>Front end React web developer currently working for Hastings Direct. Student at the University of Sussex</p>
            
                <div id="project-container">
                    {projects != null && Object.values(projects).map((project, index) => {
                        console.log(project);
                        
                        return (
                            <div className="project">
                                <Project
                                    key={index}
                                    title={project.projectName}
                                    info={project.info}
                                    photo={project.photo}
                                    skills={project.skills}
                                    sources={project.sources}  // Pass sources to Project component
                                />
                                {currentUser && 
                                <img
                                    onClick={() => handleDelete(key, project.projectName, project.info)}
                                    className="trash topright"
                                    src = "svgs/trash-white.svg"
                                    alt="Delete"
                                />
                                }
                            </div>
                        );
                    })}
                </div>

                {currentUser != null && (
                    <div className="add-project">
                        <form className={`add-project-form ${loading ? "Loading" : ""}`} onSubmit={handleSubmit}>
                            <label htmlFor="project-name">Project Name*</label>
                            <input
                                id="project-name"
                                type="text"
                                placeholder="Type project name..."
                                value={projectName}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="info">Info</label>
                            <textarea
                                id="info"
                                type="text"
                                rows="5"
                                placeholder="Type project information..."
                                value={info}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="skills">Skills Used</label>
                            <input
                                id="skills"
                                type="text"
                                placeholder="Type skills used separated by commas..."
                                value={skills}
                                onChange={handleInputChange}
                            />
                            
                            <label htmlFor="dropdown-source">Sources</label>
                            <div className="drop-down-options">
                                <select id="dropdown-source">
                                    <option value="Website">Website</option>
                                    <option value="Github">Github</option>
                                    <option value="Youtube">Youtube</option>
                                    <option value="Devpost">Devpost</option>
                                </select>
                                <input
                                    id="source-url"
                                    type="url"
                                    placeholder="Type link for source..."
                                />
                                <button type="button" onClick={addNewSource} disabled={loading}>Add</button>
                            </div>

                            <div id="source-holder">
                                {sources.length > 0 ? (
                                    sources.map((source, index) => (
                                        <span key = {index}><p key={index}>{source.type}: {source.url}</p><img onClick={() => handleDelete(index)} src = {theme === "light" ? "svgs/trash-black.svg" : "svgs/trash-white.svg"}></img></span>
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
                                <button disabled={loading} type="submit">{!loading ? "Add" : "Loading..."}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;
