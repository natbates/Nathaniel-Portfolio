import "../styles/hackathons.css";
import { ThemeContext } from "./App";
import { useContext, useState, useRef } from "react";
import { Loading, LoadingSection } from "./loading";

const Hackathon = ({title, info, photo, date, location, sources}) =>
    {

        const {theme} = useContext(ThemeContext);
        const [isInfoVisible, setIsInfoVisible] = useState(false); // State to toggle info visibility
        const [maxHeight, setMaxHeight] = useState("86px"); // Default collapsed height
        const contentRef = useRef(null); // Reference to the content for height calculation
    
        const toggleInfo = () => {
            if (!isInfoVisible) {
                // Expand: calculate the height dynamically based on scrollHeight
                const fullHeight = contentRef.current.scrollHeight + 50;
                setMaxHeight(`${fullHeight}px`);
            } else {
                // Collapse: reset to the initial height
                setMaxHeight("86px");
            }
            setIsInfoVisible((prev) => !prev); // Toggle visibility state
        };

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
            <div
                className={`hackathon ${isInfoVisible ? "show" : ""}`}
                style={{ maxHeight: maxHeight, transition: "max-height 0.5s ease" }}
                onClick={toggleInfo}
                >
                {photo != null ? 
                <a className = "hackathon-image"><img src = {photo}></img></a>
                :
                <a className= "hackathon-image">
                    <Loading />
                </a>
                }
                <div className="hackathon-text" ref={contentRef}>
                    <span className="top-line">
                        <span>
                            <h1>{title}</h1>
                            {theme === "light" ? (
                                <img className="arrow" src="svgs/arrow-black.svg" />
                            ) : (
                                <img className="arrow" src="svgs/arrow-white.svg" />
                            )}
                        </span>
                    </span>
                    <p>At <span className="hackathon-important">{location}</span> | <span>{date}</span></p>
                    <p className = "hackathon-info">{info}</p>

                    <div className="link-container">
                    {sources && sources.map((source, index) => (
                        <span key={index} className="link">
                            {getIconForSource(source.type)}  {/* Render the icon based on the source type */}
                            <a href={source.url} target="_blank" rel="noopener noreferrer">{source.type}</a>
                        </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
export default Hackathon;