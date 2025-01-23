import React, { useContext } from "react";
import { ThemeContext } from "./App";
import "../styles/projects.css";
import { LoadingSection } from "./loading";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../comps/authContext.jsx";

const Project = ({ id, title, info, photo, skills, sources, starred, refreshProjects, starredCount }) => {
    const skillList = skills ? skills.split(',').map(skill => skill.trim()) : [];
    const hasSkills = skillList.length > 0 && skillList.some(skill => skill.length > 0);

    const { theme } = useContext(ThemeContext);
    const { currentUser } = useContext(AuthContext);

    const getIconForSource = (type) => {
        const iconColor = theme !== "light" ? "black" : "white"; // Icon color based on the theme

        switch (type.trim()) {
            case "Youtube":
                return <img className="source-logo" src={`svgs/icons/youtube-${iconColor}.svg`} alt="YouTube" />;
            case "Github":
                return <img className="source-logo" src={`svgs/icons/github-${iconColor}.svg`} alt="GitHub" />;
            case "Devpost":
                return <img className="source-logo" src={`svgs/icons/devpost-${iconColor}.svg`} alt="Devpost" />;
            case "Website":
                return <img className="source-logo" src={`svgs/icons/website-${iconColor}.svg`} alt="Website" />;
            default:
                return null;
        }
    };

    // Handle toggling the "starred" status
    const toggleStar = async () => {
        if (!currentUser) return; // Ensure user is logged in
                
        console.log(starredCount);

        if (!starred && starredCount >= 4) {
            // Prevent toggling if more than 4 projects are already starred
            alert("You can only have a maximum of 4 starred projects.");
            return;
        }
    
        try {
            const projectDocRef = doc(db, "projects", id);
            await updateDoc(projectDocRef, { starred: !starred });
    
            // Call refreshProjects to re-fetch the updated projects list
            refreshProjects();
        } catch (error) {
            console.error("Error updating star status:", error);
        }
    };    

    return (
        <>
            {photo != null ? (
                <a className="project-image">
                    <img src={photo} alt={title} />
                    <div className="star-container project-star">
                        <span
                            style={currentUser ? {} : { pointerEvents: "none" }}
                            className={`star ${
                                starred
                                    ? "starred" // If starred, show the "starred" class
                                    : currentUser
                                    ? "" // If logged in and not starred, show the unstarred class
                                    : "invisible" // If not logged in, hide the star
                            }`}
                            onClick={currentUser ? toggleStar : undefined} // Only enable onClick if logged in
                        >
                            <span className="star-icon fa fa-star"></span>
                        </span>
                    </div>
                </a>
            ) : (
                <a className="project-image">
                    <LoadingSection centered={true} />
                </a>
            )}

            <div className="project-text">
                <h1>{title}</h1>
                <p>{info}</p>
            </div>

            {hasSkills && (
                <div className="skill-container">
                    {skillList.map((skill, index) => (
                        <span key={index} className="skill">
                            {skill}
                        </span>
                    ))}
                </div>
            )}
            {!hasSkills && <div className="skill-container"></div>}

            <div className="link-container">
                {sources &&
                    sources.map((source, index) => (
                        <span key={index} className="link">
                            {getIconForSource(source.type)} {/* Render the icon based on the source type */}
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                                {source.type}
                            </a>
                        </span>
                    ))}
            </div>
        </>
    );
};

export default Project;
