import "../styles/projects.css";
import Project from "../comps/project.jsx";
import Loading, { LoadingSection } from "../comps/loading.jsx";
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
    const [fetching, setFetching] = useState(false);
    const {theme} = useContext(ThemeContext);
    const [projectName, setProjectName] = useState("");
    const [info, setInfo] = useState("");
    const [skills, setSkills] = useState("");
    const [photo, setPhoto] = useState(null);
    const [sources, setSources] = useState([]);  // Track sources as an array of objects
    const [github, setGithub]= useState(null);

    // Function to clear the form fields
    const handleClear = (event) => {
      event.preventDefault(); // Prevent any default behavior (like page reload)
      formRef.current.reset(); // Reset all fields in the form
    };
  
    useEffect(() => {
        fetchGithub();
    }, []);
  
    const fetchGithub = async () => {
        try {
            const data = await fetchData("keys");
            Object.entries(data.keys).forEach(([key, value]) => {
                if (key === "github") {
                    setGithub(value);
                }
            });
            // Fetch profile picture after fetching other data
        } catch (error) {
            console.error("Error fetching github URL");
        }
    };
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
            setFetching(true);
            try {
                const projects = await fetchData("projects");
                setProjects(projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally
            {
                setFetching(false);
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
            console.error(error);
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
            
            // Step 3: Add the new project to Firestore
            const docRef = await addDoc(collection(db, "projects"), newProject);

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

    const DeleteProject = async(projectID, projectName) =>
    {
        setLoading(true);
        try {
            // Find the experience that matches the title, role, and info
            const projectToDelete = projects[projectID];
            if (
                projectToDelete.projectName === projectName
            ) {
                // Proceed to delete this experience from Firestore
                const projectDocRef = doc(db, "projects", projectID);
                await deleteDoc(projectDocRef);
                
                // Remove the experience from local state
                setProjects((prevProjects) => {
                    const updatedProjects = { ...prevProjects };
                    delete updatedProjects[projectID];
                    return updatedProjects;
                });
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
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
                return null;
        }
    };

    // Handle clear button
    const clearForm = () => {
        setProjectName("");
        setInfo("");
        setPhoto(null);
        setSkills("");
        setSources([]);  // Clear sources state
        document.getElementById("source-url").value = "";

    };

    return (
        <div id="projects" className="container">
            <div className="text-container">
                <h1>Projects</h1>
                <p>Here are some of my favouite projects I have worked on. They are all open source and were great learning experiences. I have plenty more projects in development and i list them on my <a className = "highlighted" target = "_blank" href={github}>Github profile page!</a></p>


                <div id="project-container">
                    {fetching && <LoadingSection />}
                    {Object.keys(projects).length === 0 && !fetching && <p>No Projects.</p>}
                    {projects != null && Object.entries(projects).map(([key, project], index) => {
                        return (
                            <div className="project" key={key}>
                                <Project
                                    key={key}
                                    title={project.projectName}
                                    info={project.info}
                                    photo={project.photo}
                                    skills={project.skills}
                                    sources={project.sources}  // Pass sources to Project component
                                />
                                {currentUser && 
                                <img
                                    onClick={() => DeleteProject(key, project.projectName)}
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
