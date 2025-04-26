import React from 'react';
import { useContext, useState, useEffect } from 'react';
import '../styles/navBar.css'; // Ensure this path is correct based on your folder structure
import { ThemeContext } from './App';
import fetchData from '../services/fetch-info';

const Navbar = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [x, setX] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await fetchData("socials");
                Object.entries(data.socials).forEach(([key, value]) => {
                    if (key === "github") {
                        setGithub(value);
                    } else if (key === "linkedin") {
                        setLinkedin(value);
                    } else if (key === "x") {
                        setX(value);
                    }
                });
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };
        fetchInfo();
    }, []);

    return (
        <div className="nav-bar">
            <nav>
                <section id="navigate-page">
                    <a
                        to="/"
                        className="home-icon"
                        data-tooltip="Home"
                    >
                        <img alt="home" src="/images/logo.svg" />
                    </a>

                </section>
                {/* <section id="socials">
                    <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target='_blank' data-tooltip="Linked In">
                        <img alt="linkedin" src="/svgs/linkedin.svg" />
                    </a>
                    <a href={github.startsWith('http') ? github : `https://${github}`} target='_blank' data-tooltip="Github">
                        <img alt="github" src="/svgs/github.svg" />
                    </a>
                    <a href={x.startsWith('http') ? x : `https://${x}`} target='_blank' data-tooltip="X">
                        <img alt="x" src="/svgs/x.svg" />
                    </a>
                </section>
                <section id="page-settings">
                    <a data-tooltip={theme === 'light' ? 'Dark Mode' : 'Light Mode'} onClick={toggleTheme}>
                        <img alt="lightmode" src="/svgs/lightmode.svg" />
                    </a>
                </section> */}
            </nav>
        </div>
    );
};

export default Navbar;
