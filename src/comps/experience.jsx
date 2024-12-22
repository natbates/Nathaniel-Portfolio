import React, { useRef, useState, useContext } from "react";
import "../styles/experience.css";
import { ThemeContext } from './App';
import { Loading, LoadingSection } from "./loading";

const Experience = ({ title, role, info, image, date }) => {

    const {theme, toggleTheme} = useContext(ThemeContext);
    const [isInfoVisible, setIsInfoVisible] = useState(false); // State to toggle info visibility
    const [maxHeight, setMaxHeight] = useState("48px"); // Default collapsed height
    const contentRef = useRef(null); // Reference to the content for height calculation

    const toggleInfo = () => {
        if (!isInfoVisible) {
            // Expand: calculate the height dynamically based on scrollHeight
            const fullHeight = contentRef.current.scrollHeight;
            setMaxHeight(`${fullHeight}px`);
        } else {
            // Collapse: reset to the initial height
            setMaxHeight("48px");
        }
        setIsInfoVisible((prev) => !prev); // Toggle visibility state
    };

    image = null;

    return (
        <div
            className={`experience ${isInfoVisible ? "show" : ""}`}
            style={{ maxHeight: maxHeight, transition: "max-height 0.5s ease" }}
            onClick={toggleInfo}
        >
            {image != null ?
                <div className="experience-image">
                    <img src={image}></img>
                </div>
                :
                <div className="experience-image">
                    <Loading />
                </div>
            }

            <div className="experience-text" ref={contentRef}>
            <span className="top-line">
                <span>
                    <h1>{title}</h1>
                    {theme === "light" ? (
                        <img className="arrow" src="svgs/arrow-black.svg" />
                    ) : (
                        <img className="arrow" src="svgs/arrow-white.svg" />
                    )}
                </span>
                <span>
                    <p className="date">{date == null ? "unknown" : date}</p>
                </span>
                </span>
                <p>{role}</p>
                <div className="experience-info">
                    <p>{info}</p>
                </div>
            </div>
        </div>
    );
};

export default Experience;
