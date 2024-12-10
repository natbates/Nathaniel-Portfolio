import "../styles/hackathons.css";
import { ThemeContext } from "./App";
import { useContext } from "react";

const Hackathon = ({title, info, photo, date, location, sources}) =>
    {

        const {theme} = useContext(ThemeContext);

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
                    console.log(type, "NOT HUTTT");
                    return null;
            }
        };
    
        return (
            <div className = "hackathon">
                <a className = "hackathon-image"><img src = {photo}></img></a>
                <div className="hackathon-text">
                    <h1>{title}</h1>
                    <p>At <span className="hackathon-important">{location}</span> During <span className="hackathon-important">{date}</span></p>
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