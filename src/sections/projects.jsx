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
    const [showMore, setShowMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const {theme} = useContext(ThemeContext);
    const [projectName, setProjectName] = useState("");
    const [info, setInfo] = useState("");
    const [skills, setSkills] = useState("");
    const [photo, setPhoto] = useState(null);
    const [sources, setSources] = useState([]);  // Track sources as an array of objects
    const [github, setGithub]= useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [calculatedHeight, setCalculatedHeight] = useState(0);
    const [calculatedFavouriteHeight, setCalculatedFavouriteHeight]  = useState(0);
    const [isStarred, setIsStarred] = useState(false);

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

    const fetchProjects = async () => {
        try {
            const projectsData = await fetchData("projects");
    
            // Ensure each project includes its ID for proper mapping
            const projectsWithId = Object.entries(projectsData).map(([id, data]) => ({
                id, // Firestore document ID or key
                ...data,
            }));
    
            // Sort the projects: starred first
            const sortedProjects = projectsWithId.sort(
                (a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0)
            );
    
            // Convert the array back to an object if necessary
            const sortedProjectsObject = sortedProjects.reduce((acc, project) => {
                acc[project.id] = project;
                return acc;
            }, {});
    
            // Update the state with sorted projects
            setProjects(sortedProjectsObject);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };    

    // Fetch projects on mount
    useEffect(() => {
        const fetchInfo = async () => {
            setFetching(true);
            try {
                fetchProjects();
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

        if (isStarred) {
            // Count how many projects are currently starred
            const starredProjects = Object.values(projects).filter(project => project.starred);
    
            // Prevent submission if more than 4 projects are starred
            if (starredProjects.length >= 4) {
                alert("You can only have a maximum of 4 starred projects.");
                setLoading(false);  // Stop loading state
                return;
            }
        }

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
                sources,
                starred: isStarred
            };
            
            // Step 3: Add the new project to Firestore
            const docRef = await addDoc(collection(db, "projects"), newProject);

            // Step 4: Update the local state to include the new project
            setProjects((prevProjects) => {
                const updatedProjects = {
                    ...prevProjects,
                    [docRef.id]: { id: docRef.id, ...newProject },
                };
    
                // Sort projects: Starred ones go to the top
                return Object.fromEntries(
                    Object.entries(updatedProjects).sort(
                        ([, a], [, b]) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0)
                    )
                );
            });

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
        setIsStarred(false);
    };

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        const calculateHeight = (numProjects) => {
            const isSmallScreen = screenWidth <= 730;
            const rows = isSmallScreen
                ? numProjects 
                : Math.ceil(numProjects / 2); 
            if (isSmallScreen) {return rows * 360} else {return rows * 400; }
        };

        const calculateFavouriteHeight = () =>
        {
            const isSmallScreen = screenWidth <= 730;
            if (isSmallScreen) {return 1430;} else {return 800;}
        }

        setCalculatedHeight(calculateHeight(Object.keys(projects).length));
        setCalculatedFavouriteHeight(calculateFavouriteHeight());

    }, [screenWidth, projects]);

    const projectsArray = Array.isArray(projects) ? projects : Object.values(projects);
    const starredCount = projectsArray.filter(project => project.starred).length;

    return (
        <div id="projects" className="container">
            <div className="text-container">
                <h1>Projects</h1>
                <p>Here are some of my favouite projects I have worked on. They are all open source and were great learning experiences. I have plenty more projects in development and i list them on my <a className = "highlighted" target = "_blank" href={github}>Github profile page!</a></p>

                <div id="project-container" style={!showMore ? {height: `${calculatedFavouriteHeight}px`} : { height: `${calculatedHeight}px` }}>
                    {fetching && <LoadingSection />}
                    {Object.keys(projects).length === 0 && !fetching && <p>No Projects.</p>}
                    {projects != null && Object.entries(projects).map(([key, project], index) => {
                        return (
                            <div className="project" key={key}>
                                <Project
                                    id={project.id}
                                    key={key}
                                    title={project.projectName}
                                    info={project.info}
                                    photo={project.photo}
                                    skills={project.skills}
                                    sources={project.sources}  // Pass sources to Project component
                                    starred={project.starred}
                                    refreshProjects={fetchProjects}
                                    starredCount={starredCount}
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

                <div id="show-more-projects">
                    <button 
                        id="show-more-projects-button" 
                        onClick={() => { setShowMore(!showMore); }} 
                        data-tooltip={showMore ? "Show Less" : "Show More"}
                    >
                        {theme === "light" ? (
                            <img 
                                className="show-more-arrow" 
                                style={{ transform: showMore ? "rotate(-90deg)" : "rotate(90deg)" }} 
                                src="/svgs/arrow-black.svg"
                                alt="Toggle"
                            />
                        ) : (
                            <img 
                                className="show-more-arrow" 
                                style={{ transform: showMore ? "rotate(-90deg)" : "rotate(90deg)" }} 
                                src="/svgs/arrow-white.svg"
                                alt="Toggle"
                            />
                        )}
                    </button>
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

                                <div className="star-container">
                                    <span onClick = {() => {setIsStarred((prevState) => !prevState);}} className={`star ${isStarred ? "starred" : "unstarred"}`}>
                                        <span className="star-icon fa fa-star"></span>
                                    </span>
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
