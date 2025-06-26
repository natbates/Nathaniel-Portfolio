import React, { useRef, useState, useEffect, useContext } from "react";
import "../styles/experience.css";
import { ThemeContext } from './App';
import { Loading, LoadingSection } from "./loading";

const Experience = ({ title, role, info, date }) => {
    const { theme } = useContext(ThemeContext);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [maxHeight, setMaxHeight] = useState("52px"); // Default collapsed height
    const contentRef = useRef(null);

    console.log("Experience component rendered with date:", date);

    const updateHeight = () => {
        if (contentRef.current) {
            const scrollHeight = contentRef.current.scrollHeight;
            if (isInfoVisible) {
                setMaxHeight(`${scrollHeight}px`); // Expanding, set maxHeight to scrollHeight
            } else {
                setMaxHeight("52px"); // Collapsing, set maxHeight to small value
            }
        }
    };

    const toggleInfo = () => {
        setIsInfoVisible((prev) => !prev);
    };

    useEffect(() => {
        updateHeight(); // Update immediately when isInfoVisible changes
    }, [isInfoVisible]);

    useEffect(() => {
        // Only update maxHeight when the info is visible
        if (isInfoVisible) {
            window.addEventListener("resize", updateHeight);
        }
        
        // Cleanup the event listener when the component is unmounted or when isInfoVisible changes
        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, [isInfoVisible]);

    return (
        <div
            className={`experience ${isInfoVisible ? "show" : ""}`}
            style={{ maxHeight, overflow: "hidden", transition: "max-height 0.5s ease" }}
            onClick={toggleInfo}
        >
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
