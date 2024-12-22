import React, { useContext } from "react";
import { ThemeContext } from "./App";
import "../styles/projects.css";
import { LoadingSection } from "./loading";

const Project = ({ title, info, photo, skills, sources }) => {

    const skillList = skills ? skills.split(',').map(skill => skill.trim()) : [];
    const hasSkills = skillList.length > 0 && skillList.some(skill => skill.length > 0);

    const { theme } = useContext(ThemeContext);

    const getIconForSource = (type) => {
        const iconColor = theme !== "light" ? "black" : "white"; // Icon color based on the theme
        
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

    photo = null;

    return (
        <>
            {photo != null ? 

                <a className="project-image">
                    <img src={photo} alt={title} />
                </a>
                :
                <a className="project-image"><LoadingSection centered = {true}/></a>
            }
            
            <div className="project-text">
                <h1>{title}</h1>
                <p>{info}</p>
            </div>

            {hasSkills && (
                <div className="skill-container">
                    {skillList.map((skill, index) => (
                        <span key={index} className="skill">{skill}</span>
                    ))}
                </div>
            )}
            {!hasSkills && <div className="skill-container"></div>}

            <div className="link-container">
                {sources && sources.map((source, index) => (
                    <span key={index} className="link">
                        {getIconForSource(source.type)}  {/* Render the icon based on the source type */}
                        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.type}</a>
                    </span>
                ))}
            </div>
        </>
    );
};

export default Project;
